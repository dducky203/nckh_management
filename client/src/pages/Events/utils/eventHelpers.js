export const formatDateTime = (dateString, timeDetail = null) => {
  const date = new Date(dateString);
  const dateStr = date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Nếu có timeDetail (VD: "07:00:00"), format nó
  if (timeDetail) {
    const timeParts = timeDetail.split(":");
    const time = `${timeParts[0]}:${timeParts[1]}`;
    return `${dateStr} ${time}`;
  }

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format giờ từ timeDetail (VD: "07:00:00" -> "07:00")
export const formatTimeOnly = (timeDetail) => {
  if (!timeDetail) return "";
  const timeParts = timeDetail.split(":");
  return `${timeParts[0]}:${timeParts[1]}`;
};

export const getCountdown = (dateString) => {
  const eventDate = new Date(dateString);
  const now = new Date();
  const diff = eventDate - now;

  // Only show countdown if event is within 2 days (48 hours)
  const twoDaysInMs = 25 * 24 * 60 * 60 * 1000;
  if (diff <= 0 || diff > twoDaysInMs) {
    return null;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} ngày ${hours} giờ`;
  } else if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
};

export const getTabConfig = (activeTab) => {
  const configs = {
    upcoming: {
      title: "Sự kiện sắp diễn ra",
      color: "blue",
      emptyMessage: "Chưa có sự kiện nào sắp diễn ra",
    },
    ongoing: {
      title: "Đang diễn ra",
      color: "green",
      emptyMessage: "Không có sự kiện nào đang diễn ra",
    },
    completed: {
      title: "Đã kết thúc",
      color: "gray",
      emptyMessage: "Chưa có sự kiện nào đã kết thúc",
    },
  };
  return configs[activeTab];
};
