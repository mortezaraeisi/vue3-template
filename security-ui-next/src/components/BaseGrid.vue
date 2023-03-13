<template>
  <base-layout class="base-grid bg-white border rounded">
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
              {{ row['$val_' + col.field] }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer v-if="!hidePagination">
      <div class="flex justify-between items-center p-2 border-t-2 common-text">
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
import { computed, onMounted, watch } from 'vue';
import { useFilters } from '../composition/use-filters';
import { usePagination } from '../composition/use-pagination';
import { IGridLoadEventParams } from '../definitions/IGridLoadEventParams';

interface IProps {
  modelValue: Array<any>,
  columns: Array<IGridColumn>
  selected?: Array<any>
  keyField?: string,
  search?: string,
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
const filters = useFilters();
const pagination = usePagination();

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

  let v;
  if (typeof col.mapper === 'function') {
    v = col.mapper(row);
  } else if (typeof col.mapper === 'string') {
    v = getValueByPath(col.mapper, row);
  } else {
    v = getValueByPath(col.field, row);
  }
  if (col.filter) {
    const fn = filters.getByName(col.filter);
    return fn(v);
  }
  return v ?? '-';
}

function load() {
  const currentPage = pagination.currentPage.value || 1;
  const from = (currentPage - 1) * pagination.rowsPerPage.value + 1;
  const to = currentPage * pagination.rowsPerPage.value;

  const payload: IGridLoadEventParams = {
    page: pagination.currentPage.value,
    search: props.search,
    filter: props.filter,
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
