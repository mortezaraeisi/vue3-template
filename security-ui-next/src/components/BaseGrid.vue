<template>
  <base-layout
    class="base-grid bg-white border rounded"
  >
    <template #header v-if="hasHear">
      <div class="flex flex-row flex-wrap items-center w-full p-2">
        <div class="flex-1"> {{ title }}</div>
        <div class="flex-1">
          <slot name="header"></slot>
        </div>
        <div class="mx-1">
          <label class="border rounded px-2 py-0.5 text-normal">
            <input
              type="search"
              class="outline-0"
              placeholder="جستجو ..."
              v-model="filterState.search"
              @keydown.enter="load"
            >
          </label>
        </div>
        <div class=" relative" v-if="filterState.showFilter">
          <button
            style="border-radius: 50%; height: 22px; width: 22px;"
            class="bg-primary text-white hover:bg-white hover:text-primary hover:outline-1 transition-all"
            @click="toggleFilterDialog"
          >
            <base-icon name="fa-filter" class="text-xs"/>
          </button>
          <div
            v-if="filterState.dialog"
            class="absolute left-1 grid grid-cols-1 gap-1 bg-white rounded border p-2 w-80"
          >
            <label
              v-for="f in filterCols" :key="f.field"
              class="text-normal flex flex-row "
            >
              <div class="flex-1 shrink-0"> {{ f.title }}</div>
              <input
                class="border outline-primary h-6"
                :type="f.inputType"
                v-model="f.value"
                @keydown.enter="doFilter"
              >
              <select v-if="f.allowOp" v-model="f.operand">
                <option
                  v-for="op in operands" :key="op.title"
                  :id="op.key"
                  :value="op.key"
                  :selected="op.key === f.operand"
                >
                  {{ op.title }}
                </option>
              </select>
            </label>
            <div class="flex flex-row items-center justify-center mt-2 text-normal">
              <label class="flex flex-row items-center">
                <input type="radio" class="mx-1" :value="true" v-model="filterState.isAnd">
                همه
              </label>
              <label class="flex flex-row items-center">
                <input type="radio" class="mx-1" :value="false" v-model="filterState.isAnd">
                برخی
              </label>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <base-button
                primary
                class="h-6"
                icon="fa-filter"
                label="بگرد"
                @click="doFilter"
              />
              <base-button
                secondary
                class="h-6"
                icon="fa-trash"
                label="بازنشانی"
                @click="clearFilter"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-col h-full">
      <table class="base-grid__head-table border-b-2" :style="{width: tableWidth + 'px'}">
        <colgroup>
          <col v-for="col in columns" :key="col.key" :style="col.headStyle">
        </colgroup>
        <thead>
        <tr>
          <th v-if="multiple" class="common-text" style="width: 36px">
            <input type="checkbox" :checked="isAllSelected" @change="selectAll">
          </th>
          <th
            v-for="col in columns" :key="col.key"
            class="common-text"
            :style="col.headStyle"
          >
            {{ col.title }}
          </th>
        </tr>
        </thead>
      </table>
      <div class="base-grid__main-table overflow-hidden overflow-y-auto" :style="{minWidth: tableWidth + 'px'}">
        <table class="w-full" :style="{minWidth: tableWidth + 'px'}">
          <colgroup>
            <col v-for="col in columns" :key="col.key" :style="col.cellStyle">
          </colgroup>
          <tbody>
          <tr
            v-for="row in rows" :key="row.$key"
            class="hover:bg-blue-200 cursor-pointer border-b"
            :class="row.$classes"
            @click.stop="rowClicked(row)"
          >
            <td
              v-if="multiple"
              class="flex justify-center items-center"
              style="width: 36px; height: 40px;"
            >
              <input type="checkbox" :checked="row.$isSelected">
            </td>
            <td
              v-for="col in columns" :key="col.key"
              class="text-normal"
              :style="col.cellStyle"
            >
              <component v-html="row['$val_' + col.field]"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer v-if="!hidePagination">
      <div class="flex flex-wrap justify-between items-center p-2 border-t-2 common-text">
        <div>
          {{ paginationReport }}
        </div>
        <div class="flex flex-row-reverse flex-wrap">
          <div
            v-if="pagination.hasFirstPage.value"
            class="base-grid__knob-item base-grid__knob-item--active base-grid__knob-item--hover"
            @click.stop="changePage(1)"
          >
            <base-icon name="fa-caret-left"/>
          </div>
          <div
            class="base-grid__knob-item"
            v-for="knob in knobs" :key="knob.page"
            :class="knob.classes"
            @click.stop="changePage(knob.page)"
          >
            {{ knob.page }}
          </div>
          <div
            v-if="pagination.hasLastPage.value"
            class="base-grid__knob-item base-grid__knob-item--active base-grid__knob-item--hover"
            @click.stop="changePage(pagination.totalPage.value)"
          >
            <base-icon name="fa-caret-right"/>
          </div>
        </div>
      </div>

    </template>
  </base-layout>
</template>

<script setup lang="ts">

import { IGridColumn } from '../definitions/IGridColumn';
import { computed, onMounted, reactive, ref, useSlots, watch } from 'vue';
import { useFilters } from '../composition/use-filters';
import { usePagination } from '../composition/use-pagination';
import { IGridLoadEventParams } from '../definitions/IGridLoadEventParams';

interface IProps {
  modelValue: Array<any>,
  columns: Array<IGridColumn>
  selected?: Array<any>
  keyField?: string,
  title?: string,
  searchable?: boolean,
  filter?: Array<any>
  multiple?: boolean
  loading?: boolean | number,
  totalRecords?: number,
  hidePagination?: boolean,
  recordPerPage?: number,
  switchCount?: number,
  doNotShowLoading?: boolean,
  sortMultipleColumn?: boolean, // If true, user can sort by multiple columns
}

const props = withDefaults(defineProps<IProps>(), {
  multiple: false,
  totalRecords: 0,
  recordPerPage: 0,
  switchCount: 7,
  hidePagination: false,
  doNotShowLoading: false,
  sortMultipleColumn: false,
});
const emits = defineEmits([ 'load', 'update:selected' ]);
const operands = [
  {
    key: 'in',
    title: '%',
  },
  {
    key: 'eq',
    title: '=',
  },
  {
    key: 'ne',
    title: '!=',
  },
  {
    key: 'gt',
    title: '>',
  },
  {
    key: 'gte',
    title: '>=',
  },
  {
    key: 'lt',
    title: '<',
  },
  {
    key: 'lte',
    title: '<=',
  },
];

const slots = useSlots();
const filters = useFilters();
const pagination = usePagination();

const hasHear = computed(() => !!props.title || !!slots.header || filterCols.value.length > 0);
const columns = computed(() => {
  const lst = [ ...props.columns ];
  lst.unshift({
    width: 36,
    field: '$rowIndex',
    title: 'ردیف',
    style: {
      fontSize: '.7em',
    }
  });
  return lst.map((x, i) => ({
    ...x,
    key: `${ x.field }-${ i }`,
    headStyle: {
      width: `${ x.width }px`,
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      width: `${ x.width }px`,
      maxWidth: `${ x.width }px`,
      ...x.style,
    },
  }));
});
const filterCols = computed(() => {
  return props.columns.filter(x => x.filterable).map(x => ({
    ...x,
    type: x.type ?? 'string',
    allowOp: x.type !== 'boolean',
    operand: x.type === 'boolean' ? 'eq' : 'in',
    inputType: x.type === 'boolean' ? 'checkbox' : 'text',
    value: undefined,
  }))
    .sort((x, y) => {
      if (x.type === y.type) {
        return x.title < y.title ? 1 : -1;
      }
      return x.type < y.type ? 1 : -1;
    });
});
const filterState = reactive({
  isAnd: true,
  dialog: false,
  showFilter: filterCols.value.length > 0,
  filters: [] as Array<Array<any>>,
  search: undefined,
});

const tableWidth = computed(() => {
  let width = props.columns.reduce((acc, x) => acc + (Number(x.width) || 0), 0);
  if (props.multiple) {
    width += 36;
  }
  return width + 36;
});

const rows = computed(() => props.modelValue.map((row, i) => {
  const key = props.keyField ?? 'key';
  let $isSelected: boolean;
  if (Array.isArray(props.selected)) {
    $isSelected = props.selected?.some(y => row[key] === y[key]) ?? false;
  } else {
    $isSelected = (props.selected?.[key] === row[key]) ?? false;
  }
  const $rowIndex = pagination.startedIndex.value + i;
  const newRowData = {
    ...row,
    $isSelected,
    $rowIndex,
    $originRow: row,
    $key: props.keyField ? row[props.keyField] : $rowIndex,
    $classes: $isSelected ? 'bg-blue-100' : undefined,
  };

  columns.value.forEach(col => newRowData['$val_' + col.field] = getFieldValue(newRowData, col));
  return newRowData;
}));

const knobs = computed(() => pagination.knobs.value.map(x => ({
  page: x,
  classes: {
    'base-grid__knob-item--active': x !== '...',
    'base-grid__knob-item--current': x === pagination.currentPage.value,
    'bg-blue-800': x === pagination.currentPage.value,
    'base-grid__knob-item--hover': x !== '...' && x !== pagination.currentPage.value,
  }
})));

const paginationReport = computed(() => {
  if (props.totalRecords < 1) {
    return 'موردی برای نمایش وجود ندارد';
  }
  return `نمایش ${ pagination.startedIndex.value } تا ${ pagination.startedIndex.value + props.modelValue.length - 1 } از ${ props.totalRecords }`;
});

const isAllSelected = computed(() => Array.isArray(props.selected) && (props.selected.length === props.modelValue.length));

watch(() => props.totalRecords, () => pagination.setTotalRecord(props.totalRecords));

onMounted(() => {
  pagination.setTotalRecord(props.totalRecords);
  load();
});

function getFieldValue(row: object, col: IGridColumn) {
  const getValueByPath = (path: string, origin: object = {}) => path
    .split('.')
    .reduce((acc: any, x) => (acc ?? {})[x], origin);

  let fieldValue;
  if (typeof col.mapper === 'function') {
    fieldValue = col.mapper(row);
  } else if (typeof col.mapper === 'string') {
    fieldValue = getValueByPath(col.mapper, row);
  } else {
    fieldValue = getValueByPath(col.field, row);
  }
  if (col.filter) {
    const fn = filters.getByName(col.filter);
    return fn(fieldValue);
  }
  switch (col.type) {
    case 'boolean':
      fieldValue = fieldValue
        ? `<div style="background-color: #6ccd07; border-radius: 50%; width: 15px; height: 15px; margin: 0 auto;"/>`
        : `<div style="background-color: #cecece; border-radius: 50%; width: 15px; height: 15px; margin: 0 auto;"/>`;
      break;
    case 'date':
    case 'datetime':
    case 'user':
    case 'group':
    case 'role':
    case 'mobile':
    case 'domain':
    case 'resource':
    case 'workspace':
    case 'apiKey':
      fieldValue = filters.getByName(col.type)(fieldValue);
      break;
  }
  return fieldValue ?? '-';
}

function load() {
  const currentPage = pagination.currentPage.value || 1;
  const from = (currentPage - 1) * pagination.rowsPerPage.value + 1;
  const to = currentPage * pagination.rowsPerPage.value;

  const payload: IGridLoadEventParams = {
    page: pagination.currentPage.value,
    search: filterState.search,
    filter: filterState.filters,
    totalRecords: props.totalRecords,
    from,
    to,
  };
  emits('load', payload);
}

function rowClicked(row: any) {
  let chosen = [ props.selected ].filter(Boolean).flat(1);
  if (chosen.some(x => x[props.keyField ?? 'key'] === row[props.keyField ?? 'key'])) {
    chosen = chosen.filter(x => x[props.keyField ?? 'key'] !== row[props.keyField ?? 'key']);
  } else {
    if (props.multiple) {
      chosen = chosen.concat(row.$originRow);
    } else {
      chosen = [ row.$originRow ];
    }
  }
  emits('update:selected', props.multiple === true ? chosen : chosen[0]);
}

function selectAll() {
  if (isAllSelected.value) {
    emits('update:selected', []);
  } else {
    emits('update:selected', props.modelValue);
  }
}

function changePage(page: number | string) {
  pagination.setCurrentPage(Number(page));
  load();
}

function closeFilterDialog() {
  filterState.dialog = false;
}

function toggleFilterDialog() {
  filterState.dialog = !filterState.dialog;
}

function doFilter() {
  const filters = filterCols.value.filter(x => x.value).map(x => [ x.field, x.value, x.operand ]);
  const query = filterState.isAnd ? filters : [ filters ];
  filterState.filters = query as Array<Array<any>>;
  pagination.setCurrentPage(1);
  load();
  closeFilterDialog();
}

function clearFilter() {
  filterCols.value.forEach(x => x.value = undefined);
  filterState.isAnd = true;
  doFilter();
}

function clearSearch() {
  filterState.search = undefined;
  doFilter();
}
</script>

<style lang="scss">
.base-grid {
  //height: 100%;
  overflow: hidden;

  .common-text {
    color: #afafaf;
    font-size: .8em
  }

  &__head-table {
    border-collapse: collapse;

    thead {
      tr, tr > th {
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  &__main-table {
    border-collapse: collapse;
    table-layout: fixed;

    tr {
      height: 40px;

      td, th {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  &__knob-item {
    width: 30px;
    height: 30px;
    margin: 0 8px;
    padding: 8px 0;

    color: #7b859a;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.38;
    letter-spacing: normal;
    text-align: center;
    text-decoration: none;
    border-radius: 2px;

    > &--active {
      box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.08);
      background-color: #ffffff;
      cursor: pointer;
    }

    > &--hover:hover {
      cursor: pointer;
      background-color: #ddd;
    }

    > &--current {
      background-color: var(--theme-color);
      color: white;
      cursor: default;
    }
  }
}
</style>
