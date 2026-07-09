import {
  AccessTime,
  LocationOn,
  Person,
  CheckCircle,
  ArrowForward,
} from "@mui/icons-material";
import Button from "../../../../components/common/Button";
import { formatDateTime } from "../../utils/eventHelpers";
import EventCountdown from "./EventCountdown";
import { targetDate } from "../../../../utils";

const EventCard = ({ event, activeTab, onViewDetail, onRegister, isRegistered }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.bannerImg || event.image}
          alt={event.eventName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {activeTab === "ongoing" && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-medium animate-pulse">
            Đang diễn ra
          </div>
        )}
        {activeTab === "upcoming" &&
          new Date(event.dateOfEvent) < targetDate(5) && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg backdrop-blur-sm">
              <EventCountdown targetDate={event.dateOfEvent} />
            </div>
          )}
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3
          title={event.eventName}
          className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-mainColor transition-colors"
        >
          {event.eventName}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <AccessTime fontSize="small" className="mr-2" />
            <span>{formatDateTime(event.dateOfEvent)}</span>
          </div>
          {event.location && (
            <div className="flex items-center" title={event.location}>
              <LocationOn
                fontSize="small"
                className="mr-2"
                title={event.location}
              />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          {event.organizer && (
            <div className="flex items-center">
              <Person fontSize="small" className="mr-2" />
              <span className="line-clamp-1">{event.organizer}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {activeTab === "upcoming" && (
            <Button
              onClick={(e) => onRegister(event, e)}
              size="sm"
              disabled={isRegistered}
              className={
                isRegistered
                  ? "flex-1 bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
                  : "flex-1 bg-green-600 text-white hover:bg-green-700 border-green-600"
              }
            >
              {isRegistered ? (
                <span className="flex items-center gap-1">
                  <CheckCircle fontSize="small" />
                  Đã đăng ký
                </span>
              ) : (
                "Đăng ký"
              )}
            </Button>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(event);
            }}
            variant="outline"
            size="sm"
            className={`${
              activeTab === "upcoming" ? "flex-1" : "w-full"
            } hover:bg-mainColor hover:text-black hover:border-mainColor transition-all`}
          >
            Chi tiết
            <ArrowForward className="ml-2" fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
