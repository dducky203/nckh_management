import { useEffect, useMemo, useRef, useState } from "react";
import nckhActivityService from "../../../../services/nckhActivityService";
import userService from "../../../../services/userService";
import { uploadToCloudinary } from "../../../../services/uploadService";
import { DECLARATION_OPTIONS_DEFAULT } from "./constants";
import {
  getInitialForm,
  getResettableFields,
  getUserList,
  normalizeContributors,
  resolveCatalogCode,
} from "./utils";

const getTodayString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function useDeclarationHeaderState({
  user,
  toast,
  initialActivityType,
  initialData,
  initialContributors,
}) {
  const toastRef = useRef(toast);
  const loadingUsersRef = useRef(false);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const [options, setOptions] = useState(DECLARATION_OPTIONS_DEFAULT);
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofFiles, setProofFiles] = useState([]);
  const [proofImages, setProofImages] = useState([]);
  const [form, setForm] = useState(getInitialForm(initialActivityType));
  const [contributors, setContributors] = useState([
    { userId: user?.id ?? "", role: "MAIN" },
  ]);

  useEffect(() => {
    if (!initialData) return;
    let extraDetails = {};
    try {
      const parsed = JSON.parse(initialData.detailsJson || "null");
      if (parsed && typeof parsed === "object") {
        extraDetails = parsed;
      }
    } catch {
      // ignore malformed JSON
    }
    setForm((prev) => ({
      ...prev,
      academicYear: initialData.academicYear || prev.academicYear,
      qty: initialData.qty || 1,
      title: initialData.title || "",
      description: initialData.description || "",
      publicationName: initialData.publicationName || "",
      activityDate: initialData.activityDate || "",
      venue: initialData.venue || "",
      identifierCode: initialData.identifierCode || "",
      externalLink: initialData.externalLink || "",
      detailsJson: initialData.detailsJson || "",
      extraDetails,
    }));
  }, [initialData]);

  useEffect(() => {
    if (!initialContributors || initialContributors.length === 0) return;
    setContributors(
      initialContributors.map((it) => ({
        userId: it.userId,
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
          const fallback = await userService.searchUsers("", "OTHERS", 0, 200);
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
            id: user.id,
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

  const addProofFiles = (newFiles) => {
    setProofFiles((prev) => [...prev, ...newFiles]);
  };

  const removeProofFile = (index) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addProofImages = (newFiles) => {
    setProofImages((prev) => [...prev, ...newFiles]);
  };

  const removeProofImage = (index) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  const requiresProofFile = useMemo(
    () => ["PROCEEDING", "TECH_CONSULT"].includes(form.activityType),
    [form.activityType],
  );

  const onFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onExtraDetailChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      extraDetails: { ...prev.extraDetails, [key]: value },
    }));
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
    const resolvedCatalogCode = resolveCatalogCode(
      form,
      options.generatedTypeCodes,
    );

    if (!user?.id) return "Không xác định được người dùng";
    if (!form.title?.trim()) return "Vui lòng nhập tên hoạt động";
    if (!form.activityDate) return "Vui lòng chọn thời gian hoạt động";
    if (form.activityDate >= getTodayString()) {
      return "Ngày xuất bản/ nghiệm thu phải là ngày trong quá khứ";
    }
    if (!resolvedCatalogCode) {
      return "Không xác định được tieuChiCode để lưu catalog_code";
    }
    if (requiresProofFile && proofFiles.length === 0) {
      return "Hoạt động này bắt buộc có file minh chứng";
    }

    const normalizedContributors = normalizeContributors(contributors);
    if (normalizedContributors.length === 0) {
      return "Vui lòng thêm ít nhất 1 người tham gia";
    }

    if (!normalizedContributors.some((row) => row.role === "MAIN")) {
      return "Cần có đúng 1 tác giả chính (MAIN)";
    }

    const mainCount = normalizedContributors.filter((row) => row.role === "MAIN").length;
    if (mainCount > 1) {
      return "Chỉ được phép có 1 tác giả chính (MAIN) trong nhóm";
    }

    return null;
  };

  const buildPayload = async () => {
    const catalogCode = resolveCatalogCode(form, options.generatedTypeCodes);
    const hasExtraDetails =
      form.extraDetails && Object.keys(form.extraDetails).some((k) => form.extraDetails[k] !== "" && form.extraDetails[k] != null);
    const detailsJson = hasExtraDetails
      ? JSON.stringify(form.extraDetails)
      : form.detailsJson?.trim() || null;

    const [uploadedFileUrls, uploadedImageUrls] = await Promise.all([
      Promise.all(
        proofFiles.map((f) => uploadToCloudinary(f, "nckh/proof-files")),
      ),
      Promise.all(
        proofImages.map((f) => uploadToCloudinary(f, "nckh/proof-images")),
      ),
    ]);

    return {
      academicYear: form.academicYear,
      catalogCode,
      activityType: form.activityType,
      conferenceRole: form.conferenceRole,
      conferenceLevel: form.conferenceLevel,
      intlPaperCategory: form.intlPaperCategory,
      vnPaperCategory: form.vnPaperCategory,
      proceedingLevel: form.proceedingLevel,
      proposalLevel: form.proposalLevel,
      qty: form.qty || 1,
      title: form.title.trim(),
      description: form.description?.trim() || null,
      publicationName: form.publicationName?.trim() || null,
      activityDate: form.activityDate,
      venue: form.venue?.trim() || null,
      identifierCode: form.identifierCode?.trim() || null,
      externalLink: form.externalLink?.trim() || null,
      proofFileUrls: uploadedFileUrls.length > 0 ? uploadedFileUrls : null,
      proofImageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
      detailsJson,
    };
  };

  const resetAfterSubmit = () => {
    setForm((prev) => ({
      ...prev,
      ...getResettableFields(),
    }));
    setProofFiles([]);
    setProofImages([]);
    setContributors([
      { userId: user?.id ?? "", role: "MAIN" },
    ]);
  };

  return {
    options,
    loading,
    submitting,
    setSubmitting,
    form,
    onFormChange,
    onExtraDetailChange,
    proofFiles,
    addProofFiles,
    removeProofFile,
    proofImages,
    addProofImages,
    removeProofImage,
    contributors,
    contributorOptions,
    onContributorChange,
    addContributor,
    removeContributor,
    loadUsersIfNeeded,
    requiresProofFile,
    validateForm,
    buildPayload,
    resetAfterSubmit,
  };
}
