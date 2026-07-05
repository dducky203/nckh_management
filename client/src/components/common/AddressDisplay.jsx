import { useEffect, useState } from "react";
import addressService from "../../services/addressService";
import { buildAddressDisplay } from "../../utils/addressHelpers";

const AddressDisplay = ({
  provinceCode = "",
  wardCode = "",
  addressDetail = "",
  fallbackAddress = "",
  className = "text-sm text-gray-700",
}) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let cancelled = false;

    const resolveDisplay = async () => {
      if (!provinceCode && !wardCode && !addressDetail) {
        if (!cancelled) {
          setDisplayText(
            fallbackAddress ? fallbackAddress.replace(/,\s*/g, " - ") : ""
          );
        }
        return;
      }

      let provinceLabel = "";
      let wardLabel = "";

      try {
        if (provinceCode) {
          const provinces = await addressService.getProvinces();
          const province = (Array.isArray(provinces) ? provinces : []).find(
            (item) => item.code === provinceCode
          );
          provinceLabel = province?.fullName || province?.name || "";
        }

        if (provinceCode && wardCode) {
          const wards = await addressService.getWardsByProvince(provinceCode);
          const ward = (Array.isArray(wards) ? wards : []).find(
            (item) => item.code === wardCode
          );
          wardLabel = ward?.fullName || ward?.name || "";
        }
      } catch {
        // fallback below
      }

      if (!cancelled) {
        setDisplayText(
          buildAddressDisplay({
            addressDetail,
            wardLabel,
            provinceLabel,
            fallbackAddress,
          })
        );
      }
    };

    resolveDisplay();
    return () => {
      cancelled = true;
    };
  }, [provinceCode, wardCode, addressDetail, fallbackAddress]);

  if (!displayText) {
    return <p className={`${className} text-gray-400`}>Chưa có địa chỉ</p>;
  }

  return <p className={className}>{displayText}</p>;
};

export default AddressDisplay;
