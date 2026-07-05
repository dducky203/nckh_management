import { useEffect, useRef, useState } from "react";
import {
  KeyboardArrowDown,
  LocationCity,
  Place,
  Signpost,
  Map,
} from "@mui/icons-material";
import addressService from "../../services/addressService";

const DROPDOWN_MAX_HEIGHT = "max-h-48";

const AddressDropdown = ({
  id,
  value,
  onValueChange,
  disabled,
  placeholder,
  options,
  isProfile,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((item) => item.code === value);
  const displayLabel = selected
    ? selected.fullName || selected.name
    : placeholder;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    onValueChange(code);
    setOpen(false);
  };

  const triggerClass = isProfile
    ? "w-full text-left py-2 px-3 pr-8 text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
    : "w-full text-left px-3 py-2 pr-9 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed bg-white";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`${triggerClass} ${
          !selected ? "text-gray-400" : "text-gray-900"
        }`}
      >
        <span className="block truncate">{displayLabel}</span>
      </button>

      <span
        className={`absolute top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
          isProfile ? "right-2" : "right-2"
        } ${open ? "rotate-180" : ""}`}
      >
        <KeyboardArrowDown className="w-5 h-5 text-gray-400" />
      </span>

      {open && !disabled && (
        <ul
          className={`absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg ${DROPDOWN_MAX_HEIGHT} overflow-y-auto`}
          role="listbox"
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-400">Không có dữ liệu</li>
          ) : (
            options.map((item) => {
              const label = item.fullName || item.name;
              const isSelected = item.code === value;

              return (
                <li key={item.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-mainColor font-medium"
                        : "text-gray-800"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
};

const AddressSelector = ({
  provinceCode = "",
  wardCode = "",
  addressDetail = "",
  onChange,
  disabled = false,
  showDetail = true,
  variant = "form",
}) => {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const isProfile = variant === "profile";
  const labelClass = isProfile
    ? "block text-sm font-medium text-gray-700 mb-1"
    : "block text-xs font-medium text-gray-700 mb-1";

  const formInputClass =
    "w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor disabled:bg-gray-50 disabled:text-gray-500";

  const profileInputClass =
    "w-full border-0 py-2 px-3 outline-none focus:ring-0 disabled:bg-gray-50 text-sm";

  useEffect(() => {
    let cancelled = false;

    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await addressService.getProvinces();
        if (!cancelled) {
          setProvinces(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) setProvinces([]);
      } finally {
        if (!cancelled) setLoadingProvinces(false);
      }
    };

    loadProvinces();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadWards = async () => {
      if (!provinceCode) {
        setWards([]);
        return;
      }

      setLoadingWards(true);
      try {
        const data = await addressService.getWardsByProvince(provinceCode);
        if (!cancelled) {
          setWards(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) setWards([]);
      } finally {
        if (!cancelled) setLoadingWards(false);
      }
    };

    loadWards();
    return () => {
      cancelled = true;
    };
  }, [provinceCode]);

  const emitChange = (updates) => {
    onChange?.({
      provinceCode,
      wardCode,
      addressDetail,
      ...updates,
    });
  };

  const handleProvinceChange = (value) => {
    emitChange({
      provinceCode: value,
      wardCode: "",
    });
  };

  const handleWardChange = (value) => {
    emitChange({ wardCode: value });
  };

  const handleDetailChange = (value) => {
    emitChange({ addressDetail: value });
  };

  const provincePlaceholder = loadingProvinces
    ? "Đang tải..."
    : "Chọn tỉnh/thành phố";

  const wardPlaceholder = !provinceCode
    ? "Chọn tỉnh/thành phố trước"
    : loadingWards
    ? "Đang tải..."
    : "Chọn phường/xã";

  const renderField = ({ label, icon: Icon, children }) => {
    if (!isProfile) {
      return (
        <div>
          <label className={labelClass}>{label}</label>
          {children}
        </div>
      );
    }

    return (
      <div>
        <label className={labelClass}>{label}</label>
        <div className="flex items-stretch border border-gray-300 rounded-md">
          <span className="flex items-center px-3 py-2 border-r border-gray-300 bg-gray-100 shrink-0 rounded-l-md">
            <Icon className="w-5 h-5 text-gray-500" />
          </span>
          <div className="relative flex-1 min-w-0">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={isProfile ? "space-y-4" : "space-y-3"}>
      <div
        className={
          isProfile
            ? "grid grid-cols-1 gap-4 md:grid-cols-2"
            : "grid grid-cols-1 md:grid-cols-2 gap-3"
        }
      >
        {renderField({
          label: "Tỉnh / Thành phố",
          icon: LocationCity,
          children: (
            <AddressDropdown
              id="address-province"
              value={provinceCode}
              onValueChange={handleProvinceChange}
              disabled={disabled || loadingProvinces}
              placeholder={provincePlaceholder}
              options={provinces}
              isProfile={isProfile}
            />
          ),
        })}

        {renderField({
          label: "Phường / Xã",
          icon: Place,
          children: (
            <AddressDropdown
              id="address-ward"
              value={wardCode}
              onValueChange={handleWardChange}
              disabled={disabled || !provinceCode || loadingWards}
              placeholder={wardPlaceholder}
              options={wards}
              isProfile={isProfile}
            />
          ),
        })}
      </div>

      {showDetail &&
        renderField({
          label: "Địa chỉ chi tiết",
          icon: Signpost,
          children: isProfile ? (
            <input
              type="text"
              id="address-detail"
              value={addressDetail}
              onChange={(e) => handleDetailChange(e.target.value)}
              disabled={disabled}
              className={profileInputClass}
              placeholder="Số nhà, tên đường..."
            />
          ) : (
            <div className="relative">
              <Map className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="address-detail"
                value={addressDetail}
                onChange={(e) => handleDetailChange(e.target.value)}
                disabled={disabled}
                className={`${formInputClass} pl-10`}
                placeholder="Số nhà, tên đường..."
              />
            </div>
          ),
        })}
    </div>
  );
};

export default AddressSelector;
