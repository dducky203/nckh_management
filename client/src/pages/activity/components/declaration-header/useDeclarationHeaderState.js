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
  const [proofFile, setProofFile] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [form, setForm] = useState(getInitialForm(initialActivityType));
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
    const resolvedCatalogCode = resolveCatalogCode(
      form,
      options.generatedTypeCodes,
    );

    if (!user?.id) return "Không xác định được người dùng";
    if (!form.title?.trim()) return "Vui lòng nhập tên hoạt động";
    if (!form.activityDate) return "Vui lòng chọn thời gian hoạt động";
    if (!resolvedCatalogCode) {
      return "Không xác định được tieuChiCode để lưu catalog_code";
    }
    if (requiresProofFile && !proofFile) {
      return "Hoạt động này bắt buộc có file minh chứng";
    }

    const normalizedContributors = normalizeContributors(contributors);
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
    const catalogCode = resolveCatalogCode(form, options.generatedTypeCodes);

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

  const resetAfterSubmit = () => {
    setForm((prev) => ({
      ...prev,
      ...getResettableFields(),
    }));
    setProofFile(null);
    setProofImage(null);
    setContributors([
      { userId: user?.id ? String(user.id) : "", role: "MAIN" },
    ]);
  };

  return {
    options,
    loading,
    submitting,
    setSubmitting,
    form,
    onFormChange,
    proofFile,
    setProofFile,
    proofImage,
    setProofImage,
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
