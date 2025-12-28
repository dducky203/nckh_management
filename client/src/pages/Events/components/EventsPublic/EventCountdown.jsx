import { useState, useEffect } from "react";
import { AccessTime } from "@mui/icons-material";

const EventCountdown = ({ targetDate, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target - now;

      if (difference <= 0) {
        return null;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return { days, hours, minutes, seconds };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval if countdown is finished
      if (!newTimeLeft) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <AccessTime sx={{ fontSize: 14 }} />
      <div className="flex items-center gap-1">
        {timeLeft.days > 0 && (
          <>
            <span className="font-bold">{timeLeft.days}</span>
            <span className="text-xs">ngày</span>
          </>
        )}
        <span className="font-bold">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span>:</span>
        <span className="font-bold">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span>:</span>
        <span className="font-bold">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default EventCountdown;
