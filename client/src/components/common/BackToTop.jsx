import { useState, useEffect } from 'react';
import { KeyboardArrowUp } from '@mui/icons-material';

const BackToTop = ({ threshold = 300, scrollBehavior = 'smooth', position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Kiểm tra vị trí cuộn để hiện/ẩn nút
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  // Hàm xử lý cuộn về đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: scrollBehavior
    });
  };

  // Xác định vị trí của nút (trái hoặc phải)
  const positionClass = position === 'left' ? 'left-5' : 'right-5';

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`fixed ${positionClass} bottom-5 z-50 p-2 bg-[#034657] text-white rounded-lg opacity-55 shadow-lg hover:opacity-90  `}
          aria-label="Trở về đầu trang"
        >
          <KeyboardArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default BackToTop;