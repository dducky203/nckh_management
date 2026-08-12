import { useState } from "react";
import {
  Delete,
  Edit,
  MoreHoriz,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { useToast } from "../../../context/ToastContext";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../../constants";
import newsService from "../../../services/newsService";
import noAvatarImg from "../../../assets/no-avatar-user.png";
import { getRelativeTime } from "../../../utils";

const CommentList = ({ comments, loading, user, onCommentsChange }) => {
  const toast = useToast();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

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
      toast.error(ERROR_MESSAGES.FORM.REQUIRED);
      return;
    }

    try {
      await newsService.updateComment(commentId, editContent);
      toast.success(SUCCESS_MESSAGES.COMMON.SAVE);
      setEditingCommentId(null);
      setEditContent("");
      onCommentsChange();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await newsService.deleteComment(commentId);
      toast.success(SUCCESS_MESSAGES.COMMON.DELETE);
      setOpenMenuId(null);
      onCommentsChange();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
    }
  };

  const canEditOrDelete = (comment) => {
    if (!user) return false;
    return user.id === comment.userId || user.role === 1;
  };

  if (loading && comments.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // if (comments.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-12 text-gray-400">
  //       <ChatBubbleOutline
  //         style={{ fontSize: 48, marginBottom: 8, opacity: 0.5 }}
  //       />
  //       <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 group items-start">
          <img
            src={comment.userAvatar || noAvatarImg}
            alt={comment.userName}
            className="w-9 h-9 rounded-full object-cover border border-gray-100 shadow-sm flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {editingCommentId === comment.id ? (
              <div className="bg-white border border-blue-200 rounded-2xl p-3 shadow-sm">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full text-sm text-gray-800 outline-none resize-none bg-transparent"
                  rows="3"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleUpdateComment(comment.id)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="bg-gray-100 rounded-2xl px-4 py-2.5 relative max-w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-900 truncate">
                      {comment.userName}
                    </span>
                    <span className="text-[11px] text-gray-500 font-normal">
                      {getRelativeTime(comment.createdAt)}
                    </span>
                  </div>

                  <div
                    className="text-[14px] text-gray-800 leading-relaxed whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{ __html: comment.content }} // Nếu dùng Rich Text Editor
                  />
                
                </div>

                {canEditOrDelete(comment) && (
                  <div className="relative self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(
                          openMenuId === comment.id ? null : comment.id
                        );
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreHoriz fontSize="small" />
                    </button>

                    {openMenuId === comment.id && (
                      <div className="absolute left-0 top-8 bg-white shadow-xl rounded-lg border border-gray-100 py-1 z-50 w-32 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                        <button
                          onClick={() => handleEditComment(comment)}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                        >
                          <Edit style={{ fontSize: 16 }} /> Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <Delete style={{ fontSize: 16 }} /> Xóa
                        </button>
                      </div>
                    )}

                    {/* Overlay để đóng menu khi click ra ngoài */}
                    {openMenuId === comment.id && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenuId(null)}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
