import { useState, useEffect } from 'react';
import { 
  Alert, 
  Snackbar,
  Box,
  Typography,
  IconButton,
  Slide
} from '@mui/material';
import { 
  CheckCircleOutlined, 
  ErrorOutlineOutlined, 
  InfoOutlined, 
  WarningAmberOutlined,
  Close
} from '@mui/icons-material';

// Main color theme
const mainColor = '#034657'; // Màu chính của ứng dụng - #034657 (xanh đậm)
const accentColor = '#ef9d1d'; // Màu phụ - màu cam của FITA

// Slide transition
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const ToastNotification = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose, 
  position = {
    vertical: 'bottom',
    horizontal: 'right',
  }
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
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
  }, [duration]);

  // Custom styling based on type
  const getAlertStyles = () => {
    const baseStyle = {
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      padding: '12px 16px',
      width: '100%',
      alignItems: 'center'
     
    };

    const typeStyles = {
      success: {
        backgroundColor: '#10B981',
        color: 'white',
        fontWeight: 700,
        borderLeft: `4px solid green`,
        '& .MuiAlert-icon': {
          color: 'white'
        }
      },
      error: {
        backgroundColor: 'rgba(211, 47, 47)',
         color: 'white',
        '& .MuiAlert-icon': {
          color: '#fff'
        }
      },
      warning: {
        backgroundColor: 'rgba(237, 108, 2, 0.05)',
        borderLeft: `4px solid ${accentColor}`,
        '& .MuiAlert-icon': {
          color: accentColor
        }
      },
      info: {
        backgroundColor: 'rgba(3, 70, 87, 0.05)',
        borderLeft: `4px solid ${mainColor}`,
        '& .MuiAlert-icon': {
          color: mainColor
        }
      }
    };

    return { ...baseStyle, ...typeStyles[type] };
  };

  // Icons for each type
  const alertIcon = {
    success: <CheckCircleOutlined fontSize="inherit" />,
    error: <ErrorOutlineOutlined fontSize="inherit" />,
    warning: <WarningAmberOutlined fontSize="inherit" />,
    info: <InfoOutlined fontSize="inherit" />
  };

  return (
    <Snackbar
      anchorOrigin={position}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      sx={{
        maxWidth: '380px',
        minWidth: '300px',
      }}
    >
      <Alert
        icon={alertIcon[type]}
        severity={type}
        sx={getAlertStyles()}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      >
        <Typography variant="body2" sx={{ fontWeight: 500, ml: 0.5 }}>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;