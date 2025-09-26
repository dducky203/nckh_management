import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Slide,
  useTheme
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

// Slide transition effect
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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
      iconColor: mainColor,
      iconBgColor: 'rgba(3, 70, 87, 0.1)',
      buttonColor: 'primary'
    },
    logout: {
      icon: <LogoutOutlined />,
      color: theme.palette.error.main,
      iconColor: theme.palette.error.main,
      iconBgColor: theme.palette.error.light,
      buttonColor: 'error'
    },
    delete: {
      icon: <DeleteOutline />,
      color: theme.palette.error.main,
      iconColor: theme.palette.error.main,
      iconBgColor: theme.palette.error.light,
      buttonColor: 'error'
    },
    warning: {
      icon: <WarningAmberOutlined />,
      color: accentColor,
      iconColor: accentColor,
      iconBgColor: 'rgba(239, 157, 29, 0.1)',
      buttonColor: 'warning'
    },
    info: {
      icon: <InfoOutlined />,
      color: mainColor,
      iconColor: mainColor,
      iconBgColor: 'rgba(3, 70, 87, 0.1)',
      buttonColor: 'primary'
    },
    error: {
      icon: <ErrorOutlineOutlined />,
      color: theme.palette.error.main,
      iconColor: theme.palette.error.main,
      iconBgColor: theme.palette.error.light,
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
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: 'grey.500',
            bgcolor: 'rgba(0,0,0,0.03)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.08)',
            },
            zIndex: 1
          }}
          size="small"
        >
          <CloseOutlined fontSize="small" />
        </IconButton>

        {/* Header with colored bar */}
        <Box sx={{ 
          borderTop: `4px solid ${config.color}`, 
          pt: 0.5 
        }} />

        <Box sx={{ display: 'flex', p: 3, pb: 1, pt: 2.5 }}>
          {config.icon && (
            <Box
              sx={{
                backgroundColor: config.iconBgColor,
                borderRadius: '50%',
                p: 1.2,
                mr: 2.5,
                height: 45,
                width: 45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box component="span" sx={{ color: config.iconColor, display: 'flex' }}>
                {config.icon}
              </Box>
            </Box>
          )}
          <Box>
            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 600, 
                fontSize: '1.15rem', 
                color: 'text.primary',
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ maxWidth: '95%' }}
            >
              {message}
            </Typography>
          </Box>
        </Box>

        <DialogActions 
          sx={{ 
            px: 3, 
            pb: 3, 
            pt: 2, 
            justifyContent: 'flex-end', 
            gap: 1.5 
          }}
        >
          <Button 
            onClick={onClose} 
            variant="outlined" 
            sx={{
              color: 'text.secondary',
              borderColor: 'rgba(0,0,0,0.12)',
              '&:hover': {
                borderColor: 'rgba(0,0,0,0.26)',
                bgcolor: 'rgba(0,0,0,0.03)'
              },
              fontWeight: 500,
              textTransform: 'none',
              minWidth: '90px'
            }}
            size="medium"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            variant="contained" 
            color={config.buttonColor}
            size="medium"
            sx={{ 
              boxShadow: '0 3px 5px rgba(0,0,0,0.12)', 
              fontWeight: 500,
              textTransform: 'none',
              minWidth: '90px',
              '&:hover': {
                boxShadow: '0 6px 10px rgba(0,0,0,0.14)'
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