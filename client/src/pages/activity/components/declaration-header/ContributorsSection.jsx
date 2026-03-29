import { useEffect, useMemo, useState } from "react";

export default function ContributorsSection({
  contributors,
  contributorOptions,
  onContributorChange,
  addContributor,
  removeContributor,
  loadUsersIfNeeded,
}) {
  const [searchTerms, setSearchTerms] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const contributorOptionMap = useMemo(() => {
    const map = new Map();
    contributorOptions.forEach((item) => {
      map.set(String(item.id), item);
    });
    return map;
  }, [contributorOptions]);

  const getDisplayName = (item) => {
    if (!item) return "";
    return item.name || item.username || "";
  };

  useEffect(() => {
    setSearchTerms((prev) => {
      const next = {};
      contributors.forEach((row, idx) => {
        const selected = contributorOptionMap.get(String(row.userId));
        next[idx] =
          prev[idx] !== undefined ? prev[idx] : selected ? getDisplayName(selected) : "";
      });
      return next;
    });
  }, [contributors, contributorOptionMap]);

  const handleSearchChange = (index, value) => {
    setSearchTerms((prev) => ({ ...prev, [index]: value }));
    setOpenIndex(index);
  };

  const handleInputFocus = async (index) => {
    setOpenIndex(index);
    if (contributorOptions.length > 1 || loadingUsers) return;
    setLoadingUsers(true);
    try {
      await loadUsersIfNeeded();
    } finally {
      setLoadingUsers(false);
    }
  };

  const pickUser = (index, selectedUser) => {
    onContributorChange(index, "userId", String(selectedUser.id));
    setSearchTerms((prev) => ({ ...prev, [index]: getDisplayName(selectedUser) }));
    setOpenIndex(null);
  };

  const getVisibleOptions = (index, row) => {
    const keyword = String(searchTerms[index] || "").trim();
    if (!keyword) return contributorOptions;

    const selected = contributorOptionMap.get(String(row.userId));
    const selectedLabel = getDisplayName(selected);
    if (selectedLabel && keyword === selectedLabel) {
      return contributorOptions;
    }

    const lowered = keyword.toLowerCase();
    return contributorOptions.filter((u) =>
      getDisplayName(u).toLowerCase().includes(lowered),
    );
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-extrabold text-slate-700">Người tham gia</h4>
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
            <div className="md:col-span-8 relative">
              <input
                type="text"
                value={searchTerms[idx] || ""}
                onFocus={() => handleInputFocus(idx)}
                onBlur={() => {
                  setTimeout(() => {
                    setOpenIndex((prev) => (prev === idx ? null : prev));
                  }, 120);
                }}
                onChange={(e) => handleSearchChange(idx, e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm"
                placeholder="Tìm theo tên hoặc username..."
              />
              {openIndex === idx && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-52 overflow-auto">
                  {loadingUsers ? (
                    <div className="px-3 py-2 text-xs text-slate-500">Đang tìm...</div>
                  ) : getVisibleOptions(idx, row).length === 0 ? (
                    <div className="px-3 py-2 text-xs text-slate-500">
                      Không có người dùng phù hợp
                    </div>
                  ) : (
                    getVisibleOptions(idx, row).map((u) => (
                      <button
                        key={`${idx}-${u.id}`}
                        type="button"
                        onMouseDown={() => pickUser(idx, u)}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-mainColor hover:text-white"
                      >
                        {getDisplayName(u)}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <select
              value={row.role}
              onChange={(e) => onContributorChange(idx, "role", e.target.value)}
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
  );
}