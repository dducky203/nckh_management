import { Link } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import Button from "../../../../components/common/Button";

const EventCTA = () => {
  return (
    <section className="bg-mainColor text-white py-12 mt-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Bạn là quản trị viên?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Đăng nhập để quản lý và tổ
          chức sự kiện cho cộng đồng nghiên cứu khoa học
        </p>
        <Link to="/login">
          <Button className="bg-white text-mainColor hover:bg-gray-100">
            Đăng nhập ngay
            <ArrowForward className="ml-2" fontSize="small" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default EventCTA;
