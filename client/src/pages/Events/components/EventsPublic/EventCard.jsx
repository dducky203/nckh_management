import {
  AccessTime,
  LocationOn,
  Person,
  ArrowForward,
} from "@mui/icons-material";
import Button from "../../../../components/common/Button";
import { formatDateTime, getCountdown } from "../../utils/eventHelpers";

const EventCard = ({ event, activeTab, onViewDetail, onRegister }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group">
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || "/src/assets/default-event.jpg"}
          alt={event.eventName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div
          className={`absolute top-4 right-4 px-3 py-1 rounded text-sm font-medium ${
            activeTab === "upcoming"
              ? "bg-blue-600 text-white"
              : activeTab === "ongoing"
              ? "bg-green-600 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {event.type || "Sự kiện"}
        </div>
        {activeTab === "ongoing" && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
            Đang diễn ra
          </div>
        )}
        {activeTab === "upcoming" && getCountdown(event.dateOfEvent) && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
            <div className="flex items-center gap-1">
              <AccessTime sx={{ fontSize: 14 }} />
              <span>{getCountdown(event.dateOfEvent)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-mainColor transition-colors">
          {event.eventName}
        </h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <AccessTime fontSize="small" className="mr-2" />
            <span>{formatDateTime(event.dateOfEvent)}</span>
          </div>
          {event.location && (
            <div className="flex items-center">
              <LocationOn fontSize="small" className="mr-2" />
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
              className="flex-1 bg-green-600 text-white hover:bg-green-700 border-green-600"
            >
              Đăng ký
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
