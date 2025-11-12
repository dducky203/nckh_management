import { useState, useCallback } from "react";

export const usePagination = (initialPage = 0, itemsPerPage = 20) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const goToPage = useCallback((page) => {
    setCurrentPage(page - 1); 
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const goToLastPage = useCallback(
    (totalPagesValue) => {
      setCurrentPage(Math.max((totalPagesValue || totalPages) - 1, 0));
    },
    [totalPages]
  );

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToNextPage = useCallback(
    (totalPagesValue) => {
      setCurrentPage((prev) =>
        Math.min(prev + 1, (totalPagesValue || totalPages) - 1)
      );
    },
    [totalPages]
  );

  const getPageNumbers = useCallback(() => {
    const pages = [];
    const delta = 2;
    const displayCurrentPage = currentPage + 1; // Convert to 1-based for display

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, displayCurrentPage - delta);
      let end = Math.min(totalPages - 1, displayCurrentPage + delta);

      if (displayCurrentPage <= delta + 2) {
        end = Math.min(5, totalPages - 1);
      }
      if (displayCurrentPage >= totalPages - delta - 1) {
        start = Math.max(totalPages - 4, 2);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  const resetPagination = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const updatePaginationData = useCallback((data) => {
    setTotalPages(data.totalPages || 0);
    setTotalItems(data.totalItems || 0);
  }, []);

  const startIndex = currentPage * itemsPerPage;

  const endIndex = useCallback(
    (items) => {
      const start = currentPage * itemsPerPage;
      return Math.min(start + (items?.length || 0), totalItems);
    },
    [currentPage, itemsPerPage, totalItems]
  );

  return {
    currentPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    getPageNumbers,
    resetPagination,
    updatePaginationData,
    setCurrentPage,
  };
};
