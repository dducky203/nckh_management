import { useState } from "react";
import { Close, ExpandMore, ExpandLess, Inventory } from "@mui/icons-material";
import { CRITERIA_RESEARCH } from "../../../utils/data";

/**
 * =========================
 * 13 TIÊU CHÍ + ĐẦY ĐỦ CẤP
 * =========================
 */

const ProductManagementModal = ({ isOpen, onClose, group }) => {
  const [openIds, setOpenIds] = useState([]);
  const [values, setValues] = useState({});

  const isStudent = group?.type === "student";

  const toggle = (id) =>
    setOpenIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const update = (id, field, value) =>
    setValues((p) => ({
      ...p,
      [id]: { ...p[id], [field]: value },
    }));

  /* ===== TÍNH GIỜ CHO ITEM ===== */
  const calcItem = (item) => {
    if (!item.children) {
      const plan = values[item.id]?.plan || 0;
      const actual = values[item.id]?.actual || 0;
      const planH = plan * (item.quota || 0);
      const actH = actual * (item.quota || 0);
      const percent = planH > 0 ? Math.round((actH / planH) * 100) : 0;

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
  const totalAll = CRITERIA_RESEARCH.reduce(
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
      const isParent = !!i.children;

      return (
        <>
          <tr
            key={i.id}
            className={`group transition-colors ${
              isParent ? "bg-gray-50/80" : "bg-white hover:bg-blue-50/50"
            } border-b border-gray-200 last:border-0`}
          >
            {/* Cột Expand/Collapse */}
            <td className="py-2 pl-2 w-10 text-center">
              {isParent && (
                <button
                  onClick={() => toggle(i.id)}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all"
                >
                  {openIds.includes(i.id) ? (
                    <ExpandLess fontSize="small" />
                  ) : (
                    <ExpandMore fontSize="small" />
                  )}
                </button>
              )}
            </td>

            {/* Tên tiêu chí - Có thụt đầu dòng */}
            <td className="py-2 pr-4 text-left">
              <div
                style={{ marginLeft: level * 20 }}
                className={`flex items-center ${
                  isParent ? "font-bold text-gray-800" : "text-gray-600"
                }`}
              >
                {/* Đường kẻ nối level (Option visual) */}
                {level > 0 && (
                  <span className="mr-2 text-gray-300 border-l-2 border-b-2 border-gray-300 w-3 h-3 inline-block rounded-bl-sm mb-1"></span>
                )}
                <span className="truncate">{i.name}</span>
              </div>
            </td>

            <td className="px-2 py-2 text-center text-gray-500 text-sm">
              {i.unit || "-"}
            </td>
            <td className="px-2 py-2 text-center text-gray-500 text-sm">
              {i.quota || "-"}
            </td>

            {/* INPUT KẾ HOẠCH SL */}
            <td className="px-2 py-2 text-center">
              {!isParent ? (
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-20 text-center bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1.5 shadow-sm transition-all"
                  onChange={(e) => update(i.id, "plan", e.target.value)}
                />
              ) : (
                <span className="text-gray-300">-</span>
              )}
            </td>

            <td className="px-2 py-2 text-center font-semibold text-blue-700 bg-blue-50/30">
              {!isParent ? r.planH : ""}
            </td>

            {/* INPUT THỰC TẾ SL */}
            <td className="px-2 py-2 text-center">
              {!isParent ? (
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-20 text-center bg-white border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-green-500 focus:border-green-500 block p-1.5 shadow-sm transition-all"
                  onChange={(e) => update(i.id, "actual", e.target.value)}
                />
              ) : (
                <span className="text-gray-300">-</span>
              )}
            </td>

            <td className="px-2 py-2 text-center font-semibold text-green-700 bg-green-50/30">
              {!isParent ? r.actH : ""}
            </td>

            {/* % RIÊNG TỪNG DÒNG */}
            <td className="px-2 py-2 text-center">
              {!isParent && (
                <span
                  className={`inline-flex items-center justify-center min-w-[3rem] px-2 py-0.5 text-xs font-bold rounded-full border ${
                    r.percent >= 100
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : r.percent > 0
                      ? "bg-amber-100 text-amber-700 border-amber-200"
                      : "bg-gray-100 text-gray-400 border-gray-200"
                  }`}
                >
                  {r.percent}%
                </span>
              )}
            </td>

            {/* 3 CỘT CUỐI - Spacer cho Footer alignment */}
            <td className="px-2 py-2"></td>
            <td className="px-2 py-2"></td>
            <td className="px-2 py-2"></td>
          </tr>

          {isParent &&
            openIds.includes(i.id) &&
            renderRows(i.children, level + 1)}
        </>
      );
    });

  if (!isOpen) return null;

  if (isStudent) {
    const products = group?.products || [];
    
    return (
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6 transition-opacity">
        <div className="bg-white w-full max-w-2xl h-[70vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Danh sách sản phẩm
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Sản phẩm nghiên cứu của nhóm sinh viên
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            >
              <Close />
            </button>
          </div>
          <div className="flex-1 p-6 overflow-auto bg-gray-50 flex items-center justify-center">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <Inventory fontSize="large" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Chưa có sản phẩm</h3>
                <p className="text-gray-500 max-w-sm">Nhóm sinh viên này hiện chưa cập nhật danh sách sản phẩm nghiên cứu.</p>
              </div>
            ) : (
              <div className="w-full space-y-3 h-full items-start justify-start flex flex-col">
                {products.map((p, idx) => (
                  <div key={idx} className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="font-semibold text-gray-800">{p.name || "Sản phẩm"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 sm:p-6 transition-opacity">
      <div className="bg-white w-full max-w-[98%] xl:max-w-[1400px] h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Quản lý Sản phẩm & Mức độ hoàn thành
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Nhập số lượng thực tế và kế hoạch để tính toán hiệu suất
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* TABLE WRAPPER */}
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="sticky top-0 bg-gray-100 z-10 shadow-sm text-xs uppercase font-semibold text-gray-600 tracking-wider">
              <tr>
                <th className="py-3 px-2 w-10"></th>
                <th className="py-3 px-2 min-w-[250px]">Tiêu chí</th>
                <th className="py-3 px-2 text-center w-20">Đơn vị</th>
                <th className="py-3 px-2 text-center w-20">Định mức</th>
                <th className="py-3 px-2 text-center w-28 bg-blue-50/50 text-blue-800">
                  SL Kế hoạch
                </th>
                <th className="py-3 px-2 text-center w-28 bg-blue-50/50 text-blue-800">
                  Giờ KH
                </th>
                <th className="py-3 px-2 text-center w-28 bg-green-50/50 text-green-800">
                  SL Thực tế
                </th>
                <th className="py-3 px-2 text-center w-28 bg-green-50/50 text-green-800">
                  Giờ TT
                </th>
                <th className="py-3 px-2 text-center w-24">% HT</th>
                <th className="py-3 px-2 text-center w-28 border-l border-gray-200">
                  Tổng KH
                </th>
                <th className="py-3 px-2 text-center w-28">Tổng TT</th>
                <th className="py-3 px-2 text-center w-24">% Chung</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {renderRows(CRITERIA_RESEARCH)}
            </tbody>

            {/* ===== FOOTER TỔNG ===== */}
            <tfoot className="sticky bottom-0 bg-white border-t-2 border-indigo-500 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <tr className="bg-gradient-to-r from-indigo-50 to-white">
                <td colSpan={9} className="py-4 px-6 text-right">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mr-2">
                    Tổng toàn bộ
                  </span>
                </td>
                
                {/* Tổng Plan Hours */}
                <td className="py-4 px-2 text-center font-bold text-blue-700 text-lg border-l border-indigo-100">
                  {totalAll.planH}
                </td>
                
                {/* Tổng Actual Hours */}
                <td className="py-4 px-2 text-center font-bold text-green-700 text-lg">
                  {totalAll.actH}
                </td>
                
                {/* % Tổng */}
                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-sm font-bold rounded-full shadow-sm border ${
                      percentAll >= 100
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-amber-500 text-white border-amber-600"
                    }`}
                  >
                    {percentAll}%
                  </span>
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