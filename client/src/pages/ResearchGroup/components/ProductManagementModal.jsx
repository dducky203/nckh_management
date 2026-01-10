import { useState } from "react";
import {
  Close,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

/**
 * =========================
 * 13 TIÊU CHÍ + ĐẦY ĐỦ CẤP
 * =========================
 */
const CRITERIA = [
  {
    id: "1",
    name: "Seminar",
    children: [
      { id: "1.1", name: "Trình bày Seminar", unit: "Giờ/bài", quota: 10 },
    ],
  },
  {
    id: "2",
    name: "Hội thảo",
    children: [
      {
        id: "2.1",
        name: "Tổ chức hội thảo",
        children: [
          { id: "2.1.1", name: "Cấp Quốc tế", unit: "Giờ/hội thảo", quota: 100 },
          { id: "2.1.2", name: "Cấp Quốc gia", unit: "Giờ/hội thảo", quota: 60 },
          { id: "2.1.3", name: "Cấp Học viện", unit: "Giờ/hội thảo", quota: 20 },
        ],
      },
      {
        id: "2.2",
        name: "Bài tham luận trình bày",
        children: [
          { id: "2.2.1", name: "Cấp Quốc tế", unit: "Giờ/bài", quota: 50 },
          { id: "2.2.2", name: "Cấp Quốc gia", unit: "Giờ/bài", quota: 30 },
          { id: "2.2.3", name: "Cấp Học viện", unit: "Giờ/bài", quota: 20 },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Bài báo quốc tế",
    children: [
      { id: "3.1", name: "WoS", unit: "Giờ/bài", quota: 210 },
      { id: "3.2", name: "Scopus", unit: "Giờ/bài", quota: 140 },
      { id: "3.3", name: "Tạp chí Học viện (EN)", unit: "Giờ/bài", quota: 70 },
      { id: "3.4", name: "Không WoS/Scopus", unit: "Giờ/bài", quota: 60 },
      { id: "3.5", name: "Trích dẫn", unit: "Giờ/lượt", quota: 1 },
    ],
  },
  {
    id: "4",
    name: "Bài báo tiếng Việt",
    children: [
      { id: "4.1", name: "Tạp chí Học viện", unit: "Giờ/bài", quota: 40 },
      { id: "4.2", name: "Tạp chí khác", unit: "Giờ/bài", quota: 20 },
    ],
  },
  {
    id: "5",
    name: "Bài tham luận đăng kỷ yếu",
    children: [
      { id: "5.1", name: "Quốc tế", unit: "Giờ/bài", quota: 25 },
      { id: "5.2", name: "Quốc gia", unit: "Giờ/bài", quota: 15 },
      { id: "5.3", name: "Học viện", unit: "Giờ/bài", quota: 10 },
    ],
  },
  {
    id: "6",
    name: "Bài tổng quan lĩnh vực nghiên cứu",
    children: [{ id: "6.1", name: "Bài tổng quan", unit: "Giờ/bài", quota: 10 }],
  },
  {
    id: "7",
    name: "Bản tin KH&CN Website Học viện",
    children: [{ id: "7.1", name: "Sản phẩm", unit: "Giờ/sản phẩm", quota: 5 }],
  },
  {
    id: "8",
    name: "Quy trình / Tiêu chuẩn kỹ thuật",
    children: [{ id: "8.1", name: "Sản phẩm", unit: "Giờ/sản phẩm", quota: 10 }],
  },
  {
    id: "9",
    name: "Đề xuất tuyển chọn",
    children: [
      { id: "9.1", name: "Cấp Quốc gia", unit: "Giờ/đề xuất", quota: 10 },
      { id: "9.2", name: "Cấp Bộ", unit: "Giờ/đề xuất", quota: 5 },
      { id: "9.3", name: "Học viện trọng điểm", unit: "Giờ/đề xuất", quota: 2.5 },
    ],
  },
  {
    id: "10",
    name: "Nhiệm vụ KH&CN được phê duyệt",
    children: [
      {
        id: "10.1",
        name: "Cấp Quốc gia",
        children: [
          { id: "10.1.1", name: "Chủ nhiệm", unit: "Giờ/đề tài", quota: 90 },
          { id: "10.1.2", name: "Thư ký", unit: "Giờ/đề tài", quota: 40 },
          { id: "10.1.3", name: "Tham gia", unit: "Giờ/đề tài", quota: 150 },
        ],
      },
      {
        id: "10.2",
        name: "Cấp Bộ",
        children: [
          { id: "10.2.1", name: "Chủ nhiệm", unit: "Giờ/đề tài", quota: 70 },
          { id: "10.2.2", name: "Thư ký", unit: "Giờ/đề tài", quota: 30 },
          { id: "10.2.3", name: "Tham gia", unit: "Giờ/đề tài", quota: 110 },
        ],
      },
    ],
  },
  {
    id: "11",
    name: "Tổ chức Hội đồng tư vấn",
    children: [{ id: "11.1", name: "Hội đồng", unit: "Giờ/hội đồng", quota: 20 }],
  },
  {
    id: "12",
    name: "Mời chuyên gia trình bày Seminar",
    children: [{ id: "12.1", name: "Seminar", unit: "Giờ/Seminar", quota: 15 }],
  },
  {
    id: "13",
    name: "Hoạt động KH&CN khác",
    children: [
      { id: "13.1", name: "Chương sách ISBN", unit: "Giờ/chương", quota: 80 },
      { id: "13.2", name: "Đề án Học viện", unit: "Giờ/đề án", quota: 80 },
      { id: "13.3", name: "Bài quảng bá", unit: "Giờ/bài", quota: 10 },
      { id: "13.4", name: "Giáo trình", unit: "Giờ/giáo trình", quota: 50 },
      { id: "13.5", name: "Bài giảng mới", unit: "Giờ/bài giảng", quota: 30 },
      { id: "13.6", name: "Sách chuyên khảo", unit: "Giờ/sách", quota: 40 },
      { id: "13.7", name: "Sách tham khảo", unit: "Giờ/sách", quota: 20 },
      { id: "13.8", name: "Hợp đồng KH&CN", unit: "Giờ/10tr", quota: 1 },
    ],
  },
];

const ProductManagementModal = ({ isOpen, onClose }) => {
  const [openIds, setOpenIds] = useState([]);
  const [values, setValues] = useState({});

  const toggle = (id) =>
    setOpenIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const update = (id, field, value) =>
    setValues((p) => ({
      ...p,
      [id]: { ...p[id], [field]: Number(value) },
    }));

  /* ===== TÍNH GIỜ CHO ITEM ===== */
  const calcItem = (item) => {
    if (!item.children) {
      const plan = values[item.id]?.plan || 0;
      const actual = values[item.id]?.actual || 0;
      const planH = plan * (item.quota || 0);
      const actH = actual * (item.quota || 0);
      const percent =
        planH > 0 ? Math.round((actH / planH) * 100) : 0;

      return { planH, actH, percent };
    }

    return item.children.reduce(
      (sum, c) => {
        const r = calcItem(c);
        return {
          planH: sum.planH + r.planH,
          actH: sum.actH + r.actH,
        };
      },
      { planH: 0, actH: 0 }
    );
  };

  /* ===== TỔNG TOÀN BẢNG ===== */
  const totalAll = CRITERIA.reduce(
    (sum, c) => {
      const r = calcItem(c);
      return {
        planH: sum.planH + r.planH,
        actH: sum.actH + r.actH,
      };
    },
    { planH: 0, actH: 0 }
  );

  const percentAll =
    totalAll.planH > 0
      ? Math.round((totalAll.actH / totalAll.planH) * 100)
      : 0;

  /* ===== RENDER ===== */
  const renderRows = (items, level = 0) =>
    items.map((i) => {
      const r = calcItem(i);

      return (
        <>
          <tr className={i.children ? "bg-gray-50" : ""}>
            <td style={{ paddingLeft: level * 24 }}>
              {i.children && (
                <button onClick={() => toggle(i.id)}>
                  {openIds.includes(i.id) ? <ExpandLess /> : <ExpandMore />}
                </button>
              )}
            </td>

            <td>{i.name}</td>
            <td>{i.unit || ""}</td>
            <td>{i.quota || ""}</td>

            <td>
              {!i.children && (
                <input
                  type="number"
                  className="w-20 border px-1"
                  onChange={(e) => update(i.id, "plan", e.target.value)}
                />
              )}
            </td>

            <td>{!i.children && r.planH}</td>

            <td>
              {!i.children && (
                <input
                  type="number"
                  className="w-20 border px-1"
                  onChange={(e) => update(i.id, "actual", e.target.value)}
                />
              )}
            </td>

            <td>{!i.children && r.actH}</td>

            {/* % RIÊNG TỪNG DÒNG */}
            <td
              className={
                !i.children
                  ? r.percent >= 100
                    ? "text-green-600 font-bold"
                    : "text-orange-600 font-bold"
                  : ""
              }
            >
              {!i.children && `${r.percent}%`}
            </td>

            {/* 3 CỘT CUỐI CHỈ DÙNG CHO FOOTER */}
            <td />
            <td />
            <td />
          </tr>

          {i.children &&
            openIds.includes(i.id) &&
            renderRows(i.children, level + 1)}
        </>
      );
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-[96%] max-h-[96vh] rounded shadow flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-xl font-bold">
            Quản lý sản phẩm & mức độ hoàn thành
          </h2>
          <button onClick={onClose}>
            <Close />
          </button>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border text-sm">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                <th />
                <th>Tiêu chí</th>
                <th>Đơn vị</th>
                <th>Định mức</th>
                <th>SL ĐM</th>
                <th>Giờ ĐM</th>
                <th>SL TT</th>
                <th>Giờ TT</th>
                <th>% HT</th>
                <th>Tổng giờ ĐM</th>
                <th>Tổng giờ TT</th>
                <th>% HT chung</th>
              </tr>
            </thead>

            <tbody>{renderRows(CRITERIA)}</tbody>

            {/* ===== FOOTER TỔNG ===== */}
            <tfoot className="sticky bottom-0 bg-blue-50 font-bold">
              <tr>
                <td colSpan={9} className="text-right pr-4">
                  TỔNG TOÀN BỘ
                </td>
                <td className="text-blue-700">{totalAll.planH}</td>
                <td className="text-green-700">{totalAll.actH}</td>
                <td
                  className={
                    percentAll >= 100
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                >
                  {percentAll}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagementModal;