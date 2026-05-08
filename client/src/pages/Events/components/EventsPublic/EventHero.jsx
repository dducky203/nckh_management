import { Link } from "react-router-dom";
import { Add, ArrowForward } from "@mui/icons-material";
import Button from "../../../../components/common/Button";
import { isAdmin } from "../../../../utils/permissions";

const EventHero = ({ user }) => {
  return (
    <section className="bg-gradient-to-r from-mainColor to-[#154c6e] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Sự kiện & Hội thảo
          </h1>
          <p className="text-xl mb-6">
            Khám phá và tham gia các sự kiện học thuật, hội thảo, workshop về
            nghiên cứu khoa học
          </p>
          {user && isAdmin(user) ? (
            <Link to="/events/create">
              <Button className="bg-white !text-mainColor hover:!bg-gray-100 ">
                <Add className="mr-2" />
                Tạo sự kiện mới
              </Button>
            </Link>
          ) : user ? (
            <p className="text-white/90 text-sm">
              Bạn có thể đăng ký tham gia tại danh sách bên dưới.
            </p>
          ) : (
            <Link to="/login">
              <Button className="bg-white !text-mainColor hover:!bg-gray-100 ">
                Đăng nhập để tham gia sự kiện
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventHero;
