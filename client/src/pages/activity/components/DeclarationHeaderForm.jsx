import { normalizeContributors } from "./declaration-header/utils";
import useDeclarationHeaderState from "./declaration-header/useDeclarationHeaderState";
import ActivityTypeFields from "./declaration-header/ActivityTypeFields";
import BasicDeclarationFields from "./declaration-header/BasicDeclarationFields";
import ProofFileSection from "./declaration-header/ProofFileSection";
import ContributorsSection from "./declaration-header/ContributorsSection";
import nckhActivityService from "../../../services/nckhActivityService";

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
  const {
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
    errors,
  } = useDeclarationHeaderState({
    user,
    toast,
    initialActivityType,
    initialData,
    initialContributors,
  });

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

      const duplicateCheck = await nckhActivityService.checkDuplicate(
        user.id,
        payload,
        initialData?.id ?? undefined,
      );
      const duplicateResult = duplicateCheck?.data || duplicateCheck;
      if (duplicateResult?.duplicate) {
        toast.error(duplicateResult.message || "Hoạt động này đã được khai báo trước đó");
        return;
      }

      const saved = initialData?.id
        ? await nckhActivityService.updateActivity(
            initialData.id,
            user.id,
            payload,
          )
        : await nckhActivityService.createActivity(user.id, payload);
      const activity = saved?.data || saved;

      const normalizedContributors = normalizeContributors(contributors);

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
      resetAfterSubmit();
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
          <BasicDeclarationFields
            form={form}
            options={options}
            lockActivityType={lockActivityType}
            onFormChange={onFormChange}
            errors={errors}
          />

          <ActivityTypeFields
            form={form}
            options={options}
            onFormChange={onFormChange}
            onExtraDetailChange={onExtraDetailChange}
            errors={errors}
          />

          <ProofFileSection
            requiresProofFile={requiresProofFile}
            proofFiles={proofFiles}
            addProofFiles={addProofFiles}
            removeProofFile={removeProofFile}
            proofImages={proofImages}
            addProofImages={addProofImages}
            removeProofImage={removeProofImage}
            error={errors.proofFiles}
          />

          <ContributorsSection
            contributors={contributors}
            contributorOptions={contributorOptions}
            onContributorChange={onContributorChange}
            addContributor={addContributor}
            removeContributor={removeContributor}
            loadUsersIfNeeded={loadUsersIfNeeded}
            error={errors.contributors}
          />

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
