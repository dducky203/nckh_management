import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Slide,
  useTheme,
  alpha
} from '@mui/material';
import {
  LogoutOutlined,
  DeleteOutline,
  WarningAmberOutlined,
  InfoOutlined,
  CloseOutlined,
  ErrorOutlineOutlined,
  HelpOutlineOutlined
} from '@mui/icons-material';
import { forwardRef } from 'react';

// Main color theme
const mainColor = '#034657'; // Màu chính của ứng dụng - xanh đậm
const accentColor = '#ef9d1d'; // Màu phụ - màu cam của FITA

// Slide transition effect - làm mượt hơn một chút
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={400} />;
});

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "default" // default, logout, delete, warning, info, error, help
}) => {
  const theme = useTheme();

  const typeConfig = {
    default: {
      icon: <HelpOutlineOutlined />,
      color: mainColor,
      buttonColor: 'primary'
    },
    logout: {
      icon: <LogoutOutlined />,
      color: theme.palette.error.main,
      buttonColor: 'error'
    },
    delete: {
      icon: <DeleteOutline />,
      color: theme.palette.error.main,
      buttonColor: 'error'
    },
    warning: {
      icon: <WarningAmberOutlined />,
      color: accentColor,
      buttonColor: 'warning'
    },
    info: {
      icon: <InfoOutlined />,
      color: mainColor,
      buttonColor: 'primary'
    },
    error: {
      icon: <ErrorOutlineOutlined />,
      color: theme.palette.error.main,
      buttonColor: 'error'
    }
  };

  const config = typeConfig[type] || typeConfig.default;

  return (
    <Dialog
      open={isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="modern-modal-title"
      aria-describedby="modern-modal-description"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', // Shadow hiện đại
          overflow: 'hidden',
          m: 2 // Margin cho mobile
        }
      }}
    >
      <Box sx={{ position: 'relative', p: 1 }}>
        {/* Nút Đóng (Close Button) */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              color: 'text.primary',
              transform: 'rotate(90deg)'
            },
            zIndex: 2
          }}
          size="small"
        >
          <CloseOutlined fontSize="small" />
        </IconButton>

        <DialogContent sx={{ p: 3, pt: 4, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2.5 }}>
            {/* Icon Container (Squircle Style) */}
            {config.icon && (
              <Box
                sx={{
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                  borderRadius: '14px', // Bo góc mềm mại kiểu modern
                  backgroundColor: alpha(config.color, 0.1),
                  color: config.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${alpha(config.color, 0.2)}`,
                  '& svg': {
                    fontSize: 26 // Kích thước icon chuẩn
                  }
                }}
              >
                {config.icon}
              </Box>
            )}

            {/* Content Container */}
            <Box sx={{ pt: 0.5 }}>
              <Typography
                id="modern-modal-title"
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: 'text.primary',
                  mb: 1,
                  lineHeight: 1.3
                }}
              >
                {title}
              </Typography>
              <Typography
                id="modern-modal-description"
                variant="body2"
                sx={{
                  color: '#4b5563', // Soft gray
                  lineHeight: 1.5,
                  fontSize: '0.95rem'
                }}
              >
                {message}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
            justifyContent: 'flex-end',
            gap: 1.5
          }}
        >
          <Button
            onClick={onClose}
            disableElevation
            sx={{
              color: '#4b5563',
              backgroundColor: '#f3f4f6', // Nền xám nhạt hiện đại thay vì viền
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              px: 2.5,
              py: 1,
              '&:hover': {
                backgroundColor: '#e5e7eb',
                color: '#1f2937'
              }
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant="contained"
            disableElevation
            color={config.buttonColor}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              px: 2.5,
              py: 1,
              backgroundColor: config.color,
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? alpha(config.color, 0.9)
                  : alpha(config.color, 0.85),
                boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}` // Hiệu ứng nổi nhẹ khi hover
              }
            }}
            autoFocus
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default Modal;