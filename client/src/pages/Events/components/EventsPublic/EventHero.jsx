import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, ArrowForward } from "@mui/icons-material";
import Button from "../../../../components/common/Button";
import { hasNckhStaffAccess } from "../../../../utils/permissions";
import researchGroupService from "../../../../services/researchGroupService";

const EventHero = ({ user }) => {
  const [canCreate, setCanCreate] = useState(false);

  useEffect(() => {
    if (!user) {
      setCanCreate(false);
      return;
    }
    if (hasNckhStaffAccess(user)) {
      setCanCreate(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await researchGroupService.getMyPermissions();
        if (!cancelled) setCanCreate(!!data?.canCreateSeminar);
      } catch {
        if (!cancelled) setCanCreate(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

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
          {user && canCreate ? (
            <Link to="/events/create">
              <Button className="bg-white !text-mainColor hover:!bg-gray-100 ">
                <Add className="mr-2" />
                Tạo seminar / hội thảo
              </Button>
            </Link>
          ) : user ? (
            <p className="text-white/90 text-sm">
              Chỉ trưởng nhóm và thư ký nhóm được tạo seminar/hội thảo. Bạn có thể đăng ký tham gia tại danh sách bên dưới.
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
