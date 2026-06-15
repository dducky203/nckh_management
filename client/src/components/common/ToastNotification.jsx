import { useState, useEffect } from 'react';
import {
  Snackbar,
  Typography,
  IconButton,
  Slide,
  Box
} from '@mui/material';
import {
  CheckCircleRounded,
  ErrorRounded,
  InfoRounded,
  WarningRounded,
  CloseRounded
} from '@mui/icons-material';

// Slide transition - mượt mà hơn
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" timeout={300} />;
};

const ToastNotification = ({
  message,
  type = 'success',
  duration = 3500,
  onClose,
  position = {
    vertical: 'bottom',
    horizontal: 'right',
  }
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  useEffect(() => {
    if (duration !== null) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  // Cấu hình màu sắc tinh tế cho Icon và Progress Bar
  const typeConfig = {
    success: { color: '#34d399', icon: <CheckCircleRounded /> },
    error: { color: '#f87171', icon: <ErrorRounded /> },
    warning: { color: '#fbbf24', icon: <WarningRounded /> },
    info: { color: '#38bdf8', icon: <InfoRounded /> }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <Snackbar
      anchorOrigin={position}
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      sx={{
        mb: 2,
        '& .MuiSnackbar-root': {
          zIndex: 9999
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          position: 'relative',
          overflow: 'hidden',
          minWidth: '320px',
          maxWidth: '420px',
          backgroundColor: '#18181b', // Màu nền tối (Zinc 900) cực kỳ sang trọng trên web nền trắng
          color: '#fafafa', // Chữ trắng sáng
          borderRadius: '12px',
          padding: '14px 16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1), 0px 8px 32px rgba(0, 0, 0, 0.15)', // Bóng đổ đa tầng
          border: '1px solid #27272a', // Viền siêu mờ tạo khối 3D nhẹ
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            display: 'flex',
            color: config.color,
            '& svg': { fontSize: '1.4rem' }
          }}
        >
          {config.icon}
        </Box>

        {/* Nội dung tin nhắn */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: '0.875rem', // 14px - Kích thước chuẩn cho UI hiện đại
            flex: 1,
            lineHeight: 1.4,
            letterSpacing: '-0.01em'
          }}
        >
          {message}
        </Typography>

        {/* Nút đóng */}
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            color: '#a1a1aa', // Zinc 400
            p: 0.5,
            mr: -0.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#fafafa',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          <CloseRounded sx={{ fontSize: '1.1rem' }} />
        </IconButton>

        {/* Progress Bar tinh tế dưới cùng */}
        {duration && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px', // Thanh rất mỏng
              backgroundColor: config.color,
              opacity: 0.8,
              animation: `shrink ${duration}ms linear forwards`,
              '@keyframes shrink': {
                '0%': { width: '100%' },
                '100%': { width: '0%' }
              }
            }}
          />
        )}
      </Box>
    </Snackbar>
  );
};

export default ToastNotification;