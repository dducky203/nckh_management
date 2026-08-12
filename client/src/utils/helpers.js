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

export const getBadgeColorStyles = (colorStr) => {
  const match = (colorStr || "").match(/bg-([a-z]+)-/);
  const colorName = match ? match[1] : "indigo";

  const colorStyles = {
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    gray: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return colorStyles[colorName] || colorStyles.indigo;
};

// Helper function to strip HTML tags and get plain text
export const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Helper function to validate and return safe URLs (supports http, https, relative paths, blob URLs, data URIs)
export const safeUrl = (value) => {
  if (!value) return "";
  return /^(https?:\/\/|\/|blob:|data:)/i.test(value) ? value : "";
};


