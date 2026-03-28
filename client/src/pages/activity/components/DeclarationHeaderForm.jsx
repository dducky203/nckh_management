import { useEffect, useMemo, useRef, useState } from "react";
import nckhActivityService from "../../../services/nckhActivityService";
import userService from "../../../services/userService";
import { uploadToCloudinary } from "../../../services/uploadService";

const TYPE_LABELS = {
  SEMINAR: "Seminar",
  CONFERENCE: "Hội thảo",
  INTL_PAPER: "Bài báo Quốc tế",
  VN_PAPER: "Bài báo Tiếng Việt",
  PROCEEDING: "Bài tham luận kỷ yếu (Fulltext)",
  REVIEW_PAPER: "Bài tổng quan lĩnh vực",
  TECH_CONSULT: "Tư vấn / Hướng dẫn kỹ thuật",
  TECH_PROCEDURE: "Quy trình / Tiến bộ kỹ thuật",
  PROPOSAL: "Đề xuất vào danh mục tuyển chọn",
};

const CONFERENCE_ROLE_LABELS = {
  ORG: "Tổ chức",
  PRES: "Trình bày",
};

const LEVEL_LABELS = {
  INTL: "Quốc tế",
  NAT: "Quốc gia",
  ACAD: "Học viện",
};

const INTL_CATEGORY_LABELS = {
  WOS: "WoS",
  SCOPUS: "Scopus",
  ENG_ACAD: "Tiếng Anh Học viện",
  OTHER: "Khác",
  CITATION: "Được trích dẫn",
};

const VN_CATEGORY_LABELS = {
  ACADEMY: "Tạp chí Học viện",
  OTHER: "Tạp chí khác",
};

const PROPOSAL_LEVEL_LABELS = {
  NAT: "Quốc gia",
  MINISTRY: "Cấp Bộ/Tương đương",
};

const resolveCatalogCode = (data) => {
  const activityType = String(data?.activityType || "").toUpperCase();

  switch (activityType) {
    case "SEMINAR":
      return "SEMINAR_TRINH_BAY";
    case "CONFERENCE":
      return data?.conferenceRole === "ORG" ? "HT_THAM_GIA" : "HT_THAM_LUAN";
    case "INTL_PAPER":
      if (data?.intlPaperCategory === "ENG_ACAD") return "BB_TA_HOCVIEN";
      if (data?.intlPaperCategory === "SCOPUS") return "BB_SCOPUS";
      return "BB_WOS_SCOPUS";
    case "VN_PAPER":
      return "BB_TV_HOCVIEN";
    case "PROCEEDING":
      return "BTL_FULL_TEXT";
    case "REVIEW_PAPER":
      return "TONG_QUAN";
    case "TECH_CONSULT":
    case "TECH_PROCEDURE":
      return "TU_VAN_BAN_TIN";
    case "PROPOSAL":
      return "DE_XUAT_BO";
    default:
      return "";
  }
};

const getUserList = (raw) => {
  const source =
    raw?.data?.result ||
    raw?.data?.content ||
    raw?.data ||
    raw?.result ||
    raw?.content ||
    raw;
  if (!Array.isArray(source)) return [];
  return source
    .map((it) => ({
      id: Number(it.id ?? it.userId),
      name: it.name || it.fullName || it.username || `User #${it.id}`,
      username: it.username || "",
    }))
    .filter((it) => Number.isFinite(it.id));
};

export default function DeclarationHeaderForm({
  user,
  toast,
  initialActivityType = "SEMINAR",
  lockActivityType = false,
  heading = "Khai báo hoạt động NCKH",
  subheading = "Nhập thông tin và lưu khai báo",
  initialData = null,
  initialContributors = null,
  onCompleted,
}) {
  const toastRef = useRef(toast);
  const loadingUsersRef = useRef(false);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [options, setOptions] = useState({
    activityTypes: [],
    conferenceRoles: [],
    conferenceLevels: [],
    intlPaperCategories: [],
    vnPaperCategories: [],
    proceedingLevels: [],
    proposalLevels: [],
  });
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [proofFile, setProofFile] = useState(null);
  const [proofImage, setProofImage] = useState(null);

  const [form, setForm] = useState({
    academicYear: new Date().getFullYear(),
    activityType: initialActivityType,
    conferenceRole: "ORG",
    conferenceLevel: "INTL",
    intlPaperCategory: "WOS",
    vnPaperCategory: "ACADEMY",
    proceedingLevel: "INTL",
    proposalLevel: "NAT",
    qty: 1,
    title: "",
    description: "",
    publicationName: "",
    activityDate: "",
    venue: "",
    identifierCode: "",
    externalLink: "",
    detailsJson: "",
  });

  const [contributors, setContributors] = useState([
    { userId: user?.id ? String(user.id) : "", role: "MAIN" },
  ]);

  useEffect(() => {
    if (!initialData) return;
    setForm((prev) => ({
      ...prev,
      academicYear: Number(initialData.academicYear || prev.academicYear),
      qty: Number(initialData.qty || 1),
      title: initialData.title || "",
      description: initialData.description || "",
      publicationName: initialData.publicationName || "",
      activityDate: initialData.activityDate || "",
      venue: initialData.venue || "",
      identifierCode: initialData.identifierCode || "",
      externalLink: initialData.externalLink || "",
      detailsJson: initialData.detailsJson || "",
    }));
  }, [initialData]);

  useEffect(() => {
    if (!initialContributors || initialContributors.length === 0) return;
    setContributors(
      initialContributors.map((it) => ({
        userId: String(it.userId),
        role: it.role || "MEMBER",
      })),
    );
  }, [initialContributors]);

  useEffect(() => {
    if (!initialActivityType) return;
    setForm((prev) => ({ ...prev, activityType: initialActivityType }));
  }, [initialActivityType]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const optRes = await nckhActivityService.getDeclarationOptions();

        if (cancelled) return;

        setOptions((prev) => ({ ...prev, ...(optRes?.data || optRes || {}) }));
      } catch (error) {
        if (!cancelled) {
          toastRef.current?.error(
            error?.message || "Không tải được dữ liệu khai báo",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadUsersIfNeeded = async () => {
    if (usersLoaded || loadingUsersRef.current) return;
    loadingUsersRef.current = true;

    try {
      let userList = [];
      try {
        const usersRes = await userService.getUsers({ page: 0, size: 200 });
        userList = getUserList(usersRes);
      } catch {
        userList = [];
      }

      if (userList.length === 0) {
        try {
          const fallback = await userService.getAllUsers({
            page: 0,
            size: 200,
          });
          userList = getUserList(fallback);
        } catch {
          userList = [];
        }
      }

      setUsers(userList);
      setUsersLoaded(true);
    } catch (error) {
      toastRef.current?.error(
        error?.message || "Không tải được danh sách người dùng",
      );
    } finally {
      loadingUsersRef.current = false;
    }
  };

  const contributorOptions = useMemo(() => {
    const currentUserOption = user?.id
      ? [
          {
            id: Number(user.id),
            name: user.name || user.username || `User #${user.id}`,
            username: user.username || "",
          },
        ]
      : [];

    const merged = [...currentUserOption, ...users];
    const uniqMap = new Map();
    for (const item of merged) {
      if (!uniqMap.has(item.id)) {
        uniqMap.set(item.id, item);
      }
    }
    return Array.from(uniqMap.values());
  }, [user, users]);

  const requiresProofFile = useMemo(
    () => ["PROCEEDING", "TECH_CONSULT"].includes(form.activityType),
    [form.activityType],
  );

  const onFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onContributorChange = (index, key, value) => {
    setContributors((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  };

  const addContributor = async () => {
    await loadUsersIfNeeded();
    setContributors((prev) => [...prev, { userId: "", role: "MEMBER" }]);
  };

  const removeContributor = (index) => {
    setContributors((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!user?.id) return "Không xác định được người dùng";
    if (!form.title?.trim()) return "Vui lòng nhập tên hoạt động";
    if (!form.activityDate) return "Vui lòng chọn thời gian hoạt động";
    if (!resolveCatalogCode(form)) {
      return "Không xác định được tieuChiCode để lưu catalog_code";
    }
    if (requiresProofFile && !proofFile) {
      return "Hoạt động này bắt buộc có file minh chứng";
    }

    const normalizedContributors = contributors
      .map((row) => ({ ...row, userId: Number(row.userId) }))
      .filter((row) => Number.isFinite(row.userId));

    if (normalizedContributors.length === 0) {
      return "Vui lòng thêm ít nhất 1 người tham gia";
    }

    if (!normalizedContributors.some((row) => row.role === "MAIN")) {
      return "Cần có ít nhất 1 tác giả chính (MAIN)";
    }

    return null;
  };

  const buildPayload = async () => {
    let proofFileUrl = "";
    let proofImageUrl = "";
    const catalogCode = resolveCatalogCode(form);

    if (proofFile) {
      proofFileUrl = await uploadToCloudinary(proofFile, "nckh/proof-files");
    }

    if (proofImage) {
      proofImageUrl = await uploadToCloudinary(proofImage, "nckh/proof-images");
    }

    return {
      academicYear: Number(form.academicYear),
      catalogCode,
      activityType: form.activityType,
      conferenceRole: form.conferenceRole,
      conferenceLevel: form.conferenceLevel,
      intlPaperCategory: form.intlPaperCategory,
      vnPaperCategory: form.vnPaperCategory,
      proceedingLevel: form.proceedingLevel,
      proposalLevel: form.proposalLevel,
      qty: Number(form.qty || 1),
      title: form.title.trim(),
      description: form.description?.trim() || null,
      publicationName: form.publicationName?.trim() || null,
      activityDate: form.activityDate,
      venue: form.venue?.trim() || null,
      identifierCode: form.identifierCode?.trim() || null,
      externalLink: form.externalLink?.trim() || null,
      proofFileUrl: proofFileUrl || null,
      proofImageUrl: proofImageUrl || null,
      detailsJson: form.detailsJson?.trim() || null,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validateForm();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setSubmitting(true);
    try {
      const payload = await buildPayload();
      const saved = initialData?.id
        ? await nckhActivityService.updateActivity(
            initialData.id,
            user.id,
            payload,
          )
        : await nckhActivityService.createActivity(user.id, payload);
      const activity = saved?.data || saved;

      const normalizedContributors = contributors
        .map((row) => ({
          userId: Number(row.userId),
          role: row.role,
        }))
        .filter((row) => Number.isFinite(row.userId));

      const participantsN = normalizedContributors.length;

      await nckhActivityService.addContributors(
        activity.id,
        normalizedContributors.map((row) => ({
          userId: row.userId,
          role: row.role,
          participantsN,
          note: null,
        })),
      );

      await nckhActivityService.submitActivity(activity.id, user.id);

      toast.success(
        initialData?.id
          ? "Cập nhật khai báo và gửi duyệt thành công"
          : "Khai báo và gửi duyệt thành công",
      );
      setForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        publicationName: "",
        activityDate: "",
        venue: "",
        identifierCode: "",
        externalLink: "",
        detailsJson: "",
        qty: 1,
      }));
      setProofFile(null);
      setProofImage(null);
      setContributors([
        { userId: user?.id ? String(user.id) : "", role: "MAIN" },
      ]);
      onCompleted?.();
    } catch (error) {
      toast.error(error?.message || "Khai báo thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-slate-800">{heading}</h3>
        <span className="text-[11px] font-semibold text-slate-500">
          {subheading}
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải danh mục khai báo...</p>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {lockActivityType ? (
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500">
                  Loại hoạt động
                </span>
                <input
                  readOnly
                  value={TYPE_LABELS[form.activityType] || form.activityType}
                  className="h-10 rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-700"
                />
              </label>
            ) : (
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500">
                  Loại hoạt động
                </span>
                <select
                  value={form.activityType}
                  onChange={(e) => onFormChange("activityType", e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                >
                  {(options.activityTypes || []).map((type) => (
                    <option key={type} value={type}>
                      {TYPE_LABELS[type] || type}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Năm học</span>
              <input
                type="number"
                value={form.academicYear}
                onChange={(e) => onFormChange("academicYear", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Số lượng</span>
              <input
                type="number"
                min="1"
                value={form.qty}
                onChange={(e) => onFormChange("qty", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Ngày hoạt động
              </span>
              <input
                type="date"
                value={form.activityDate}
                onChange={(e) => onFormChange("activityDate", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              />
            </label>
          </div>

          {form.activityType === "CONFERENCE" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500">
                  Vai trò hội thảo
                </span>
                <select
                  value={form.conferenceRole}
                  onChange={(e) =>
                    onFormChange("conferenceRole", e.target.value)
                  }
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                >
                  {(options.conferenceRoles || []).map((it) => (
                    <option key={it} value={it}>
                      {CONFERENCE_ROLE_LABELS[it] || it}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-500">
                  Cấp độ hội thảo
                </span>
                <select
                  value={form.conferenceLevel}
                  onChange={(e) =>
                    onFormChange("conferenceLevel", e.target.value)
                  }
                  className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                >
                  {(options.conferenceLevels || []).map((it) => (
                    <option key={it} value={it}>
                      {LEVEL_LABELS[it] || it}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {form.activityType === "INTL_PAPER" && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Danh mục bài báo quốc tế
              </span>
              <select
                value={form.intlPaperCategory}
                onChange={(e) =>
                  onFormChange("intlPaperCategory", e.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              >
                {(options.intlPaperCategories || []).map((it) => (
                  <option key={it} value={it}>
                    {INTL_CATEGORY_LABELS[it] || it}
                  </option>
                ))}
              </select>
            </label>
          )}

          {form.activityType === "VN_PAPER" && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Danh mục bài báo tiếng Việt
              </span>
              <select
                value={form.vnPaperCategory}
                onChange={(e) =>
                  onFormChange("vnPaperCategory", e.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              >
                {(options.vnPaperCategories || []).map((it) => (
                  <option key={it} value={it}>
                    {VN_CATEGORY_LABELS[it] || it}
                  </option>
                ))}
              </select>
            </label>
          )}

          {form.activityType === "PROCEEDING" && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Cấp độ kỷ yếu
              </span>
              <select
                value={form.proceedingLevel}
                onChange={(e) =>
                  onFormChange("proceedingLevel", e.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              >
                {(options.proceedingLevels || []).map((it) => (
                  <option key={it} value={it}>
                    {LEVEL_LABELS[it] || it}
                  </option>
                ))}
              </select>
            </label>
          )}

          {form.activityType === "PROPOSAL" && (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Cấp độ đề xuất
              </span>
              <select
                value={form.proposalLevel}
                onChange={(e) => onFormChange("proposalLevel", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              >
                {(options.proposalLevels || []).map((it) => (
                  <option key={it} value={it}>
                    {PROPOSAL_LEVEL_LABELS[it] || it}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Tên hoạt động
              </span>
              <input
                value={form.title}
                onChange={(e) => onFormChange("title", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                placeholder="Nhập tên bài/seminar/đề xuất..."
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Tên tạp chí/kỷ yếu/nơi công bố
              </span>
              <input
                value={form.publicationName}
                onChange={(e) =>
                  onFormChange("publicationName", e.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                placeholder="Nếu có"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Địa điểm / Cơ quan / Đơn vị thụ hưởng
              </span>
              <input
                value={form.venue}
                onChange={(e) => onFormChange("venue", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                ISSN/DOI/ISBN/Số quyết định
              </span>
              <input
                value={form.identifierCode}
                onChange={(e) => onFormChange("identifierCode", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs font-bold text-slate-500">
                Link bài báo / minh chứng
              </span>
              <input
                value={form.externalLink}
                onChange={(e) => onFormChange("externalLink", e.target.value)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
                placeholder="https://..."
              />
            </label>

            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs font-bold text-slate-500">
                Mô tả thêm
              </span>
              <textarea
                value={form.description}
                onChange={(e) => onFormChange("description", e.target.value)}
                rows={2}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                File minh chứng {requiresProofFile ? "(bắt buộc)" : ""}
              </span>
              <input
                type="file"
                onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm file:mr-3 file:border-0 file:bg-slate-100 file:px-2 file:py-1"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">
                Hình minh chứng
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProofImage(e.target.files?.[0] || null)}
                className="h-10 rounded-lg border border-slate-200 px-3 text-sm file:mr-3 file:border-0 file:bg-slate-100 file:px-2 file:py-1"
              />
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-slate-700">
                Người tham gia
              </h4>
              <button
                type="button"
                onClick={addContributor}
                className="text-xs font-bold text-mainColor"
              >
                + Thêm thành viên
              </button>
            </div>

            <div className="space-y-2">
              {contributors.map((row, idx) => (
                <div
                  key={`${idx}-${row.userId}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2"
                >
                  <select
                    value={row.userId}
                    onChange={(e) =>
                      onContributorChange(idx, "userId", e.target.value)
                    }
                    className="md:col-span-8 h-9 rounded-lg border border-slate-200 px-3 text-sm"
                  >
                    <option value="">Chọn người tham gia</option>
                    {contributorOptions.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} {u.username ? `(${u.username})` : ""}
                      </option>
                    ))}
                  </select>

                  <select
                    value={row.role}
                    onChange={(e) =>
                      onContributorChange(idx, "role", e.target.value)
                    }
                    className="md:col-span-3 h-9 rounded-lg border border-slate-200 px-3 text-sm"
                  >
                    <option value="MAIN">Tác giả chính</option>
                    <option value="MEMBER">Thành viên</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeContributor(idx)}
                    disabled={contributors.length === 1}
                    className="md:col-span-1 h-9 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 disabled:opacity-40"
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500">
              Chi tiết mở rộng (JSON, không bắt buộc)
            </span>
            <textarea
              value={form.detailsJson}
              onChange={(e) => onFormChange("detailsJson", e.target.value)}
              rows={2}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder='Ví dụ: {"contractNo":"HD-2026-01"}'
            />
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="h-10 rounded-lg bg-mainColor px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {submitting ? "Đang lưu..." : "Lưu khai báo"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
