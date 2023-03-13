<template>
  <base-page
    title="لیست نقش ها و گروه ها"
    :loading="state.loading"
  >
    <base-grid
      key-field="NidGroup"
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
    field: 'name',
    title: 'نام انگلیسی',
    width: 200,
    sortable: true,
  },
  {
    field: 'title',
    title: 'عنوان',
    width: 200,
    sortable: true,
  },
  {
    field: 'type',
    mapper: ({ type = '' }) => type === 'role' ? 'نقش' : 'گروه',
    title: 'نوع',
    width: 100,
    sortable: true,
  },
  {
    field: 'label',
    title: 'سمت سازمانی',
    width: 100,
    sortable: true,
  },
  {
    field: 'enabled',
    title: 'فعال',
    width: 150,
    cell: 'base-boolean',
  },
  {
    field: 'attribute',
    title: 'ویژگی ها',
    width: 100,
  },
  {
    field: 'description',
    title: 'توضیحات',
    width: 300,
  },
  {
    field: 'userCreator',
    title: 'کاربر ایجاد کننده',
    width: 200,
    filter: 'user',
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
    const { hasError, dd } = await api.post('v2/groups/group-list', {
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
