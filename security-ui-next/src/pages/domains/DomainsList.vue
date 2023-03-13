<template>
  <base-page
    title="دامنه های زیرمجموعه"
    :loading="state.loading"
  >
    <base-grid
      key-field="code"
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
    field: 'code',
    title: 'کد',
    width: 100,
    sortable: true,
  },
  {
    field: 'name',
    title: 'نام',
    width: 200,
    sortable: true,
  },
  {
    field: 'state',
    title: 'ناحیه',
    width: 100,
    sortable: true,
  },
  {
    field: 'city',
    title: 'شهر',
    width: 100,
    sortable: true,
  },
  {
    field: 'region',
    title: 'بخش',
    width: 100,
    sortable: true,
  },
  {
    field: 'description',
    title: 'توضیحات',
    width: 300,
  },
  {
    field: 'createdAt',
    title: 'ایجاد',
    width: 250,
    filter: 'datetime',
  },
];

async function load(opt: IGridLoadEventParams) {
  try {
    state.loading = true;
    const { hasError, dd } = await api.post('/v2/domains/domain-list', {
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
  }finally {
    state.loading = false;
  }
}

async function selectedRow(row: object) {
  console.log('selected', row);
}
</script>
