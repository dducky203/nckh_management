import { useState, useEffect, useCallback } from "react";

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (customUrl = url, customOptions = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(customUrl, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
            ...customOptions.headers,
          },
          ...options,
          ...customOptions,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  // Auto-fetch on mount if URL is provided
  useEffect(() => {
    if (url && options.autoFetch !== false) {
      fetchData();
    }
  }, [fetchData, url, options.autoFetch]);

  const refetch = () => fetchData();

  const post = (postData) =>
    fetchData(url, {
      method: "POST",
      body: JSON.stringify(postData),
    });

  const put = (putData) =>
    fetchData(url, {
      method: "PUT",
      body: JSON.stringify(putData),
    });

  const patch = (patchData) =>
    fetchData(url, {
      method: "PATCH",
      body: JSON.stringify(patchData),
    });

  const del = () =>
    fetchData(url, {
      method: "DELETE",
    });

  return {
    data,
    loading,
    error,
    refetch,
    fetchData,
    post,
    put,
    patch,
    delete: del,
  };
};
