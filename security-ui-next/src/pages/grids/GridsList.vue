<template>
  <base-page
    title="لیست گریدها"
    :loading="state.loading"
  >
    <base-grid
      key-field="name"
      :columns="columns"
      :total-records="state.totalRecords"
      v-model="state.list"
      v-model:selected="state.selected"
      @load="load"
      @update:selected="selectedRow"
    />
  </base-page>
</template>

<script setup lang="ts">

import { reactive } from 'vue';
import { useApi } from '../../composition/use-api';
import { useRoute } from 'vue-router';
import { useLogger } from '../../composition/use-logger';
import { IGridColumn } from '../../definitions/IGridColumn';
import { IGridLoadEventParams } from '../../definitions/IGridLoadEventParams';

const api = useApi();
const logger = useLogger();

const state = reactive({
  list: [] as Array<any>,
  totalRecords: 0,
  selected: [],
  loading: false,
});

const columns: Array<IGridColumn> = [
  {
    field: 'img',
    title: 'تصویر',
    cell: 'base-group',
    width: 70,
  },
  {
    field: 'workspaceTitle',
    title: 'نام برنامه',
    mapper: 'workspace.title',
    width: 200,
    sortable: true,
  },
  {
    field: 'workspaceName',
    title: 'شناسه برنامه',
    mapper: 'workspace.name',
    width: 200,
    sortable: true,
  },
  {
    field: 'title',
    title: 'عنوان گرید',
    width: 250,
    sortable: true,
  },
  {
    field: 'name',
    title: 'شناسه گرید',
    width: 250,
    sortable: true,
  },
  {
    field: 'createdAt',
    title: 'ایجاد',
    width: 180,
    filter: 'datetime',
  },
  {
    field: 'updatedAt',
    title: 'بروزرسانی',
    width: 180,
    filter: 'datetime',
  },
];

async function load(opt: IGridLoadEventParams) {
  try {
    state.loading = true;
    const { hasError, dd } = await api.post('/v2/permission-grid/grid-list', {
      from: opt.from,
      to: opt.to,
      search: opt.search,
      filter: opt.filter,
      populate: true,
    });
    if (hasError) {
      return;
    }
    state.list = dd.list;
    state.totalRecords = dd.total;
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loading = false;
  }
}

async function selectedRow(row: object) {
  console.log('selected', row);
}
</script>
