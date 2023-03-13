<template>
  <base-page
    title="لیست برنامه ها"
    :loading="state.loading"
  >
    <base-grid
      key-field="NidWorkspace"
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
    width: 70,
  },
  {
    field: 'name',
    title: 'نام',
    width: 200,
    sortable: true,
  },
  {
    field: 'title',
    title: 'عنوان',
    width: 100,
    sortable: true,
  },
  {
    field: 'permissions',
    title: 'اعضا',
    width: 500,
  },
  {
    field: 'userCreator',
    title: 'ایجادکننده',
    width: 150,
    filter: 'user',
    sortable: true,
  },
  {
    field: 'description',
    title: 'توضیحات',
    width: 300,
  },
];

async function load(opt: IGridLoadEventParams) {
  try {
    state.loading = true;
    const { hasError, dd } = await api.post('/v2/workspaces/workspace-list', {
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
