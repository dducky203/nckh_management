import { useState, useEffect, useContext } from "react";
import { 
  Send, 
  ChatBubbleOutline, 
  Lock, 
  KeyboardArrowDown, 
  KeyboardArrowUp 
} from "@mui/icons-material";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { ERROR_MESSAGES } from "../../../constants";
import newsService from "../../../services/newsService";
import noAvatarImg from "../../../assets/no-avatar-user.png";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";

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
    <div className="p-6 bg-white border-t border-gray-100 pt-8 mt-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-mainColor rounded-full">
          <ChatBubbleOutline fontSize="small" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Thảo luận <span className="text-gray-500 font-normal text-base ml-1">({comments.length})</span>
        </h3>
      </div>

      {/* Comment Form Section */}
      <div className="mb-8">
        {user ? (
          <form onSubmit={handleSubmitComment} className="flex gap-4 items-start">
            <img
              src={user.avatar || noAvatarImg}
              alt={user.name}
              className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm shrink-0"
            />
            <div className="flex-1 relative group">
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chia sẻ ý kiến của bạn..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all resize-none text-sm min-h-[100px]"
                  disabled={submitting}
                />
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400 italic">
                  *Bình luận văn minh, lịch sự
                </span>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="inline-flex items-center px-6 py-2 bg-mainColor text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-all shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                       <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Đang gửi...
                    </span>
                  ) : (
                    <>
                      <Send className="mr-2" style={{ fontSize: 16 }} />
                      Gửi bình luận
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-4 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <Lock fontSize="small" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                Vui lòng <Link to="/login" className="font-bold text-mainColor hover:underline">đăng nhập</Link> để tham gia thảo luận về bài viết này.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Comments List Section */}
      <div className="space-y-6">
        <CommentList
          comments={showAll ? comments : comments.slice(0, 5)} // Mặc định hiện 5 thôi cho gọn
          loading={loading}
          user={user}
          onCommentsChange={fetchComments}
        />
      </div>

      {/* Expand/Collapse Actions */}
      {comments.length > 5 && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
          {!showAll ? (
            <button
              onClick={() => setShowAll(true)}
              className="group flex flex-col items-center gap-1 text-xs font-semibold text-gray-500 hover:text-mainColor transition-colors"
            >
              <span>Xem thêm {comments.length - 5} bình luận</span>
              <KeyboardArrowDown className="group-hover:translate-y-1 transition-transform" fontSize="small" />
            </button>
          ) : (
            <button
              onClick={() => setShowAll(false)}
              className="group flex flex-col items-center gap-1 text-xs font-semibold text-gray-500 hover:text-mainColor transition-colors"
            >
              <KeyboardArrowUp className="group-hover:-translate-y-1 transition-transform" fontSize="small" />
              <span>Thu gọn danh sách</span>
            </button>
          )}
        </div>
      )}
      
      {comments.length === 0 && !loading && (
        <p className="text-center text-gray-400 text-sm italic py-4">
          Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ ý kiến!
        </p>
      )}
    </div>
  );
};

export default NewsComments;