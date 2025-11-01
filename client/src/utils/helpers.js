export const roleStringToInt = (roleString) => {
  if (typeof roleString === "number") {
    return roleString;
  }

  const converted = (() => {
    switch (roleString?.toLowerCase()) {
      case "admin":
        return 1;
      case "user":
        return 2;
      default:
        return 2;
    }
  })();

  return converted;
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
