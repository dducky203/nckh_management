import { useState, useEffect, useContext } from "react";
import { Send, Delete, Person, Edit, MoreVert } from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import newsService from "../../../services/newsService";
import noAvatarImg from "../../../assets/no-avatar-user.png";
import { getRelativeTime } from "../../../utils";

const NewsComments = ({ newsId }) => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await newsService.getComments(newsId);
      setComments(response?.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest(".relative")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Vui lòng nhập nội dung comment");
      return;
    }

    if (!user) {
      toast.error("Vui lòng đăng nhập để comment");
      return;
    }

    try {
      setSubmitting(true);
      await newsService.createComment(newsId, newComment);
      setNewComment("");

      await fetchComments();
    } catch (error) {
      toast.error(error.message || "Không thể thêm comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    setOpenMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) {
      toast.error("Vui lòng nhập nội dung comment");
      return;
    }

    try {
      await newsService.updateComment(commentId, editContent);
      toast.success("Đã cập nhật comment");
      setEditingCommentId(null);
      setEditContent("");
      await fetchComments();
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await newsService.deleteComment(commentId);
      toast.success("Đã xóa comment");
      setOpenMenuId(null);
      await fetchComments();
    } catch (error) {
      toast.error(error.message || "Không thể xóa comment");
    }
  };

  const canEditOrDelete = (comment) => {
    if (!user) return false;
    return user.id === comment.userId || user.role === 1;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Bình luận ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <img
              src={user.avatar || noAvatarImg}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex w-full gap-x-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={submitting}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="w-32 inline-flex items-center px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Send className="mr-2" fontSize="small" />
                  {submitting ? "Đang gửi..." : "Bình luận"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-600">
            Vui lòng{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              đăng nhập
            </a>{" "}
            để bình luận
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 group">
              <img
                src={comment.userAvatar || noAvatarImg}
                alt={comment.userName}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 bg-gray-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">
                      {comment.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getRelativeTime(comment.createdAt)}
                    </p>
                  </div>
                  {canEditOrDelete(comment) && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === comment.id ? null : comment.id
                          )
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-gray-800 p-1"
                        title="Tùy chọn"
                      >
                        <MoreVert fontSize="small" />
                      </button>
                      {openMenuId === comment.id && (
                        <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Edit fontSize="small" />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Delete fontSize="small" />
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {editingCommentId === comment.id ? (
                  <div className="mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows="3"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-1.5 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsComments;
