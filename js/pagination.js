// Pagination logic (arrow functions) - emits 'pageChange' custom event
(() => {
  // Config
  const selectors = {
    prevBtn: ".pagination .page-btn.prev",
    nextBtn: ".pagination .page-btn.next",
    currentPage: ".pagination .current-page",
    totalPages: ".pagination .total-pages",
    loadMore: "#load-more",
  };

  // Helper: dispatch pageChange event
  const dispatchPageChange = (page) => {
    const event = new CustomEvent("pageChange", { detail: { page } });
    window.dispatchEvent(event);
  };

  // Initialize
  const init = () => {
    const prev = document.querySelector(selectors.prevBtn);
    const next = document.querySelector(selectors.nextBtn);
    const currentEl = document.querySelector(selectors.currentPage);
    const totalEl = document.querySelector(selectors.totalPages);
    const loadMore = document.querySelector(selectors.loadMore);

    if (!prev || !next || !currentEl || !totalEl) {
      // Nothing to do if pagination UI isn't present
      return;
    }

    let current = parseInt(currentEl.textContent, 10) || 1;
    const total = parseInt(totalEl.textContent, 10) || 1;

    // Update UI helper
    const updateUI = () => {
      currentEl.textContent = current;
      prev.disabled = current <= 1;
      next.disabled = current >= total;
    };

    // Handlers (arrow functions)
    const onPrev = () => {
      if (current <= 1) return;
      current -= 1;
      updateUI();
      dispatchPageChange(current);
    };

    const onNext = () => {
      if (current >= total) return;
      current += 1;
      updateUI();
      dispatchPageChange(current);
    };

    const onLoadMore = () => {
      // If using load more to incrementally increase page, move to next page
      if (current < total) {
        current += 1;
        updateUI();
        dispatchPageChange(current);
      }
    };

    // Attach events
    prev.addEventListener("click", onPrev);
    next.addEventListener("click", onNext);
    if (loadMore) loadMore.addEventListener("click", onLoadMore);

    // Expose a small API on window.pagination to allow programmatic control
    window.pagination = {
      goTo: (page) => {
        const p = Math.max(1, Math.min(total, Number(page) || 1));
        if (p === current) return;
        current = p;
        updateUI();
        dispatchPageChange(current);
      },
      next: () => onNext(),
      prev: () => onPrev(),
      getState: () => ({ current, total }),
    };

    // Initial UI state
    updateUI();
  };

  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
