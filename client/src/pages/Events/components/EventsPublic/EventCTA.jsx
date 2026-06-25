import { Link } from "react-router-dom";
import { ArrowForward, Login } from "@mui/icons-material";
import Button from "../../../../components/common/Button";

const EventCTA = () => {
  return (
    <section className="bg-mainColor text-white py-12 mt-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Tham gia sự kiện ngay</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Đăng nhập tài khoản để đăng ký tham gia các hội thảo, seminar và sự
          kiện nghiên cứu khoa học tại khoa.
        </p>
        <Link to="/login">
          <Button className="bg-white text-mainColor hover:bg-gray-100">
            <Login className="mr-2" fontSize="small" />
            Đăng nhập để đăng ký
            <ArrowForward className="ml-2" fontSize="small" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default EventCTA;
