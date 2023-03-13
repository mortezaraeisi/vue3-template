import { computed, reactive } from 'vue';

export function usePagination() {
  const state = reactive({
    totalRecord: 0,
    currentPage: 1,
    rowsPerPage: 20,
  });

  const totalPage = computed(() => Math.ceil(state.totalRecord / state.rowsPerPage) || 1);
  const currentPage = computed(() => state.currentPage);
  const startedIndex = computed(() => (state.currentPage - 1) * state.rowsPerPage + 1);
  const hasFirstPage = computed(() => state.currentPage > 1);
  const hasLastPage = computed(() => state.currentPage < totalPage.value);
  const rowsPerPage = computed(() => state.rowsPerPage);
  const knobs = computed(() => {
    if (totalPage.value <= 7) {
      return Array(totalPage.value).fill(0).map((_, i) => i + 1);
    }
    if (state.currentPage <= 4) {
      return [ 1, 2, 3, 4, 5, '...', totalPage.value ];
    }
    if (totalPage.value - state.currentPage <= 3) {
      return [ 1, '...', totalPage.value - 4, totalPage.value - 3, totalPage.value - 2, totalPage.value - 1, totalPage.value ];
    }
    return [ 1, '...', state.currentPage - 1, state.currentPage, state.currentPage + 1, '...', totalPage.value ];
  });

  function setCurrentPage(to: number) {
    if (to <= 0) to = 1;
    if (to > totalPage.value) to = totalPage.value;
    state.currentPage = to;
  }

  function setTotalRecord(total: number) {
    state.totalRecord = total;
  }

  return {
    knobs,
    totalPage,
    currentPage,
    hasLastPage,
    rowsPerPage,
    hasFirstPage,
    startedIndex,
    setCurrentPage,
    setTotalRecord,
  };
}
