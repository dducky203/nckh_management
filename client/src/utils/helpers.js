export const roleStringToInt = (roleString, roleList = null) => {
  if (typeof roleString === "number") {
    return roleString;
  }

  const r = (roleString ?? "").toString().trim().toLowerCase();
  if (roleList?.length) {
    const found = roleList.find(
      (x) => (x.name ?? "").toString().trim().toLowerCase() === r
    );
    if (found != null) return found.id;
  }

  switch (r) {
    case "admin":
      return 1;
    case "user":
      return 2;
    case "assistant":
      return 3;
    default:
      return 2;
  }
};
export const titleStringToInt = (titleString) => {
  if (typeof titleString === "number") {
    return titleString;
  }

  const converted = (() => {
    switch (titleString?.toLowerCase()) {
      case "gs_pgs":
        return 1;
      case "ts":
        return 2;
      case "ths":
        return 3;
      case "ks_cn":
        return 4;
      case "sinh viên":
        return 5;
      default:
        return 5;
    }
  })();

  return converted;
};

export const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return value.toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

export const downloadFileFromResponse = (
  response,
  fileName = "download.xlsx",
  options = {}
) => {
  const { tryGetFileNameFromHeader = true } = options;

  if (!response) {
    throw new Error("Response is required");
  }

  const blob = response?.data;
  if (!blob) {
    throw new Error("Response does not contain file data");
  }

  let finalName = fileName;

  if (tryGetFileNameFromHeader) {
    const contentDisposition = response?.headers?.["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(
        /filename\*?=(?:UTF-8''|")?([^";]+)"?/i
      );
      if (match?.[1]) {
        try {
          finalName = decodeURIComponent(match[1]);
        } catch {
          finalName = match[1];
        }
      }
    }
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = finalName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
