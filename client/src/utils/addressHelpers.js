export const formatAddressLine = (...parts) =>
  parts.filter((part) => part != null && String(part).trim() !== "").join(" - ");

export const buildAddressDisplay = ({
  addressDetail,
  wardLabel,
  provinceLabel,
  fallbackAddress,
}) => {
  const line = formatAddressLine(addressDetail, wardLabel, provinceLabel);
  if (line) return line;
  if (fallbackAddress?.trim()) {
    return fallbackAddress.replace(/,\s*/g, " - ");
  }
  return "";
};
