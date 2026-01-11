import React, { useState } from "react";
import { ExpandMore, ExpandLess, Save, Info, Calculate, CheckCircle, WarningAmber } from "@mui/icons-material";

// 1. Định mức Chỉ tiêu từ Bảng 1 & Bảng 2 (Dùng để so sánh Đạt/Thiếu)
const TARGET_STANDARDS = {
  STANDARD: { // Bảng 1
    "GS/PGS": { total: 300, sem: 2, conf: 2, intArt: 0.6, viArt: 0.5, project: 0.4 },
    "TS": { total: 220, sem: 1, conf: 1, intArt: 0.4, viArt: 1, project: 0.4 },
    "ThS": { total: 140, sem: 1, conf: 1, intArt: 0, viArt: 0.5, project: 0 },
    "KS/CN": { total: 70, sem: 1, conf: 1, intArt: 0, viArt: 0.5, project: 0 }
  },
  STRONG_GROUP: { // Bảng 2
    "GS/PGS": { total: 300, sem: 1.6, conf: 1.6, intArt: 0.48, viArt: 0.4, project: 0.32 },
    "TS": { total: 220, sem: 0.8, conf: 0.8, intArt: 0.32, viArt: 0.4, project: 0.32 },
    "ThS": { total: 140, sem: 0.8, conf: 0.8, intArt: 0, viArt: 0.8, project: 0.8 },
    "KS/CN": { total: 70, sem: 0.8, conf: 0.8, intArt: 0, viArt: 0.4, project: 0.8 }
  }
};

const ActivityStandards = () => {
  const [userConfig, setUserConfig] = useState({ title: "TS", isStrongGroup: false });
  const [values, setValues] = useState({});
  const [openIds, setOpenIds] = useState(["1", "2", "3", "10"]);

  // 2. Dữ liệu Đầy đủ 13 Danh mục không cắt bớt
  const CRITERIA = [
    { id: "1", name: "1. Seminar", targetKey: "sem", children: [
        { id: "1.1", name: "Trình bày Seminar", unit: "Giờ/bài", quota: 10 },
    ]},
    { id: "2", name: "2. Hội thảo", targetKey: "conf", children: [
        { id: "2.1", name: "Tổ chức hội thảo cấp Quốc tế", unit: "Giờ/HT", quota: 100 },
        { id: "2.2", name: "Tổ chức hội thảo cấp Quốc gia", unit: "Giờ/HT", quota: 60 },
        { id: "2.3", name: "Tổ chức hội thảo cấp Học viện", unit: "Giờ/HT", quota: 20 },
        { id: "2.4", name: "Trình bày tại hội thảo cấp Quốc tế", unit: "Giờ/bài", quota: 50, isTeam: true },
        { id: "2.5", name: "Trình bày tại hội thảo cấp Quốc gia", unit: "Giờ/bài", quota: 30, isTeam: true },
        { id: "2.6", name: "Trình bày tại hội thảo cấp Học viện", unit: "Giờ/bài", quota: 20, isTeam: true },
    ]},
    { id: "3", name: "3. Bài báo quốc tế", targetKey: "intArt", children: [
        { id: "3.1", name: "Bài báo thuộc danh mục WoS", unit: "Giờ/bài", quota: 210, isTeam: true },
        { id: "3.2", name: "Bài báo thuộc danh mục Scopus", unit: "Giờ/bài", quota: 140, isTeam: true },
        { id: "3.3", name: "Bài báo tiếng Anh (Tạp chí Học viện)", unit: "Giờ/bài", quota: 70, isTeam: true },
        { id: "3.4", name: "Bài báo quốc tế khác (không WoS/Scopus)", unit: "Giờ/bài", quota: 60, isTeam: true },
        { id: "3.5", name: "Trích dẫn bài báo tiếng Anh của HV", unit: "Giờ/bài", quota: 1 },
    ]},
    { id: "4", name: "4. Bài báo tiếng Việt", targetKey: "viArt", children: [
        { id: "4.1", name: "Tạp chí của Học viện (tiếng Việt)", unit: "Giờ/bài", quota: 40, isTeam: true },
        { id: "4.2", name: "Bài báo đăng trên các tạp chí khác", unit: "Giờ/bài", quota: 20, isTeam: true },
    ]},
    { id: "5", name: "5. Bài tham luận hội thảo đăng kỷ yếu", children: [
        { id: "5.1", name: "Hội thảo cấp Quốc tế", unit: "Giờ/bài", quota: 25, isTeam: true },
        { id: "5.2", name: "Hội thảo cấp Quốc gia", unit: "Giờ/bài", quota: 15, isTeam: true },
        { id: "5.3", name: "Hội thảo cấp Học viện", unit: "Giờ/bài", quota: 10, isTeam: true },
    ]},
    { id: "6", name: "6. Bài tổng quan về lĩnh vực nghiên cứu", children: [
        { id: "6.1", name: "Bài tổng quan", unit: "Giờ/bài", quota: 10, isTeam: true },
    ]},
    { id: "7", name: "7. Tư vấn/Hướng dẫn KT/Bản tin website", children: [
        { id: "7.1", name: "Hoạt động tư vấn/website", unit: "Giờ/SP", quota: 5 },
    ]},
    { id: "8", name: "8. Quy trình/Tiêu chuẩn/Góp ý văn bản", children: [
        { id: "8.1", name: "Quy trình/Góp ý văn bản", unit: "Giờ/SP", quota: 10 },
    ]},
    { id: "9", name: "9. Đề xuất nhiệm vụ KH&CN", children: [
        { id: "9.1", name: "Đề xuất cấp Quốc gia", unit: "Giờ/đề xuất", quota: 10 },
        { id: "9.2", name: "Đề xuất cấp Bộ và tương đương", unit: "Giờ/đề xuất", quota: 5 },
        { id: "9.3", name: "Đề xuất cấp Học viện trọng điểm", unit: "Giờ/đề xuất", quota: 2.5 },
    ]},
    { id: "10", name: "10. Nhiệm vụ KH&CN được phê duyệt", targetKey: "project", children: [
        { id: "10.1", name: "Cấp Quốc gia: Chủ nhiệm", unit: "Giờ/đề tài", quota: 90 },
        { id: "10.2", name: "Cấp Quốc gia: Thư ký khoa học", unit: "Giờ/đề tài", quota: 40 },
        { id: "10.3", name: "Cấp Quốc gia: Tham gia (tối đa 8 người)", unit: "Giờ/đề tài", quota: 150, isTeam: true },
        { id: "10.4", name: "Cấp Bộ: Chủ nhiệm", unit: "Giờ/đề tài", quota: 70 },
        { id: "10.5", name: "Cấp Bộ: Thư ký khoa học", unit: "Giờ/đề tài", quota: 30 },
        { id: "10.6", name: "Cấp Bộ: Tham gia (tối đa 8 người)", unit: "Giờ/đề tài", quota: 110, isTeam: true },
        { id: "10.7", name: "Cấp Học viện trọng điểm: Chủ nhiệm", unit: "Giờ/đề tài", quota: 40 },
        { id: "10.8", name: "Cấp Học viện trọng điểm: Tham gia", unit: "Giờ/đề tài", quota: 50, isTeam: true },
        { id: "10.9", name: "Hướng dẫn sinh viên NCKH", unit: "Giờ/nhóm", quota: 15 },
    ]},
    { id: "11", name: "11. Hội đồng tư vấn định hướng NC", children: [
        { id: "11.1", name: "Tổ chức hội đồng tư vấn", unit: "Giờ/hội đồng", quota: 20 },
    ]},
    { id: "12", name: "12. Mời chuyên gia trình bày Seminar", children: [
        { id: "12.1", name: "Mời chuyên gia quốc tế/trong nước", unit: "Giờ/Seminar", quota: 15 },
    ]},
    { id: "13", name: "13. Các hoạt động KH&CN khác", children: [
        { id: "13.1", name: "Chương sách nước ngoài (ISBN)", unit: "Giờ/chương", quota: 80, isTeam: true },
        { id: "13.2", name: "Xây dựng đề án Học viện", unit: "Giờ/đề án", quota: 120, isTeam: true },
        { id: "13.3", name: "Giáo trình xuất bản (lần đầu)", unit: "Giờ/GT", quota: 100, isTeam: true },
        { id: "13.4", name: "Sách chuyên khảo", unit: "Giờ/sách", quota: 40, isTeam: true },
        { id: "13.5", name: "Sách tham khảo", unit: "Giờ/sách", quota: 20, isTeam: true },
        { id: "13.6", name: "Hợp đồng KH&CN (về TK Học viện)", unit: "Giờ/10tr", quota: 1 },
    ]}
  ];

  // 3. Logic Tính toán & So sánh
  const updateValue = (id, field, val) => {
    setValues(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const calculateRowHours = (child) => {
    const data = values[child.id] || { actual: 0, n: 1, role: "main" };
    const qty = parseFloat(data.actual) || 0;
    const n = parseInt(data.n) || 1;
    if (!child.isTeam) return qty * child.quota;
    const share = (2 * child.quota) / (3 * n);
    const unitHours = data.role === "main" ? (child.quota / 3 + share) : share;
    return qty * unitHours;
  };

  const getGroupStats = (group) => {
    const totalHours = group.children.reduce((sum, child) => sum + calculateRowHours(child), 0);
    const totalQty = group.children.reduce((sum, child) => sum + (parseFloat(values[child.id]?.actual) || 0), 0);
    return { totalHours, totalQty };
  };

  const currentTarget = TARGET_STANDARDS[userConfig.isStrongGroup ? "STRONG_GROUP" : "STANDARD"][userConfig.title];
  const totalAllHours = CRITERIA.reduce((sum, group) => sum + getGroupStats(group).totalHours, 0);

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Header Cấu hình */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-blue-600 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2 uppercase">
              <Calculate className="text-blue-600" /> Hệ thống kê khai NCKH
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Dữ liệu chuẩn 13 Danh mục & Quy đổi giờ</p>
          </div>
          <div className="flex gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex flex-col border-r pr-4 border-blue-200">
              <label className="text-[10px] font-black text-blue-400 uppercase">Chức danh</label>
              <select className="font-bold text-blue-700 bg-transparent outline-none cursor-pointer" value={userConfig.title} onChange={e => setUserConfig({...userConfig, title: e.target.value})}>
                <option value="GS/PGS">Giáo sư / PGS</option><option value="TS">Tiến sĩ</option><option value="ThS">Thạc sĩ</option><option value="KS/CN">KS / Cử nhân</option>
              </select>
            </div>
            <div className="flex flex-col pl-2">
              <label className="text-[10px] font-black text-blue-400 uppercase">Chế độ</label>
              <select className="font-bold text-orange-600 bg-transparent outline-none cursor-pointer" value={userConfig.isStrongGroup} onChange={e => setUserConfig({...userConfig, isStrongGroup: e.target.value === "true"})}>
                <option value="false">Ngoài nhóm</option><option value="true">Nhóm NC Mạnh</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dashboard Tóm tắt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-gray-400">
            <span className="text-xs font-black text-gray-400 uppercase">Định mức tổng (Tiết)</span>
            <p className="text-4xl font-black text-gray-700">{currentTarget.total}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500 bg-blue-50/20">
            <span className="text-xs font-black text-blue-500 uppercase">Thực hiện (Tiết)</span>
            <p className="text-4xl font-black text-blue-700">{totalAllHours.toFixed(1)}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
            <span className="text-xs font-black text-green-500 uppercase">Tỷ lệ hoàn thành</span>
            <p className={`text-4xl font-black ${totalAllHours >= currentTarget.total ? 'text-green-600' : 'text-orange-500'}`}>
              {Math.round((totalAllHours/currentTarget.total)*100)}%
            </p>
          </div>
        </div>

        {/* Bảng Dữ liệu Chính */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-white text-[10px] uppercase tracking-tighter">
              <tr>
                <th className="p-4 w-10">#</th>
                <th className="p-4">Nội dung công việc (13 Danh mục)</th>
                <th className="p-4 text-center w-24">SL nhập</th>
                <th className="p-4 text-center w-80">Cấu hình Tác giả (n)</th>
                <th className="p-4 text-right w-32">Giờ quy đổi</th>
                <th className="p-4 text-center w-32">Định mức</th>
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map(group => {
                const stats = getGroupStats(group);
                const targetQty = currentTarget[group.targetKey] || 0;
                const isMet = stats.totalQty >= targetQty;

                return (
                  <React.Fragment key={group.id}>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <td className="p-3 text-center">
                        <button onClick={() => setOpenIds(prev => prev.includes(group.id) ? prev.filter(x => x !== group.id) : [...prev, group.id])} className="p-1 hover:bg-white rounded-full transition-all shadow-sm">
                          {openIds.includes(group.id) ? <ExpandLess /> : <ExpandMore />}
                        </button>
                      </td>
                      <td className="p-3 font-black text-sm text-gray-700">{group.name}</td>
                      <td className="p-3 text-center font-bold text-gray-500">{stats.totalQty}</td>
                      <td></td>
                      <td className="p-3 text-right font-black text-blue-600">{stats.totalHours.toFixed(1)}</td>
                      <td className="p-3 text-center">
                        {group.targetKey && (
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 border ${isMet ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
                            {isMet ? <CheckCircle fontSize="inherit" /> : <WarningAmber fontSize="inherit" />}
                            {stats.totalQty} / {targetQty}
                          </div>
                        )}
                      </td>
                    </tr>

                    {openIds.includes(group.id) && group.children.map(child => (
                      <tr key={child.id} className="border-b text-sm hover:bg-blue-50/30 transition-colors">
                        <td></td>
                        <td className="p-4">
                          <span className="font-bold text-gray-600">{child.name}</span>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 italic">Đơn vị: {child.unit} (S={child.quota})</p>
                        </td>
                        <td className="p-4 text-center">
                          <input type="number" min="0" placeholder="0" className="w-16 border-2 border-gray-200 rounded-lg p-1.5 text-center font-black text-blue-700 focus:border-blue-500 outline-none shadow-sm"
                                 onChange={e => updateValue(child.id, 'actual', e.target.value)} />
                        </td>
                        <td className="p-4">
                          {child.isTeam && (
                            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-2xl p-2 flex items-center gap-2 shadow-md">
                              <span className="text-[10px] font-black text-yellow-700 uppercase ml-1">Số người n =</span>
                              <input type="number" min="1" defaultValue="1" 
                                     className="w-16 bg-white border-2 border-yellow-500 rounded-lg text-center font-black text-2xl text-red-600 outline-none shadow-inner"
                                     onChange={e => updateValue(child.id, 'n', e.target.value)} />
                              <div className="h-8 w-px bg-yellow-400 mx-2"></div>
                              <select className="bg-transparent font-black text-[11px] uppercase text-gray-700 cursor-pointer"
                                      onChange={e => updateValue(child.id, 'role', e.target.value)}>
                                <option value="main">Chủ trì</option>
                                <option value="member">Thành viên</option>
                              </select>
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-right font-bold text-gray-500 italic">
                          {calculateRowHours(child).toFixed(1)}
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Info /></div>
            <div>
              <p className="text-sm font-black text-blue-400 uppercase">Lưu ý quan trọng</p>
              <p className="text-xs text-gray-400 leading-relaxed">Định mức Bảng 1/Bảng 2 tính theo Số bài/năm. Tổng giờ NCKH quy đổi tính theo Bảng Quy đổi.<br/>Dữ liệu được cập nhật tự động khi thay đổi Chức danh hoặc Chế độ làm việc.</p>
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-400 px-10 py-4 rounded-2xl font-black uppercase text-sm flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-green-900/20">
            <Save /> Xuất báo cáo kê khai
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityStandards;