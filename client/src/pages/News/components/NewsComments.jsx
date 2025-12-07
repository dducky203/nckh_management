import { useState, useEffect, useContext } from "react";
import { Send } from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { ERROR_MESSAGES } from "../../../constants";
import newsService from "../../../services/newsService";
import noAvatarImg from "../../../assets/no-avatar-user.png";
import CommentList from "./CommentList";

const NewsComments = ({ newsId }) => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error(ERROR_MESSAGES.FORM.REQUIRED);
      return;
    }

    if (!user) {
      toast.error(ERROR_MESSAGES.UNAUTHORIZED);
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
              className="w-10 h-10 rounded-md border border-gray-300 object-cover"
            />
            <div className="flex w-full gap-x-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="w-full px-4  border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
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
      <CommentList
        comments={showAll ? comments : comments.slice(0, 10)}
        loading={loading}
        user={user}
        onCommentsChange={fetchComments}
      />

      {/* Show More Button */}
      {!showAll && comments.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
          >
            Xem tất cả {comments.length} bình luận
          </button>
        </div>
      )}

      {showAll && comments.length > 10 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(false)}
            className="text-gray-600 hover:text-gray-700 font-medium text-sm hover:underline"
          >
            Thu gọn
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsComments;
