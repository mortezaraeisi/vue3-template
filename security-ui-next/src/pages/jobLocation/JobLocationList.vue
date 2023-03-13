<template>
  <base-page
    title="لیست محل های خدمت"
    :loading="state.loading"
  >
    <base-grid
      key-field="NidJobLocation"
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
    width: 250,
    sortable: true,
  },
  {
    field: 'CI_City',
    title: 'کد شهر',
    width: 70,
    sortable: true,
  },
  {
    field: 'city',
    title: 'نام شهر',
    width: 120,
    sortable: true,
  },
  {
    field: 'allowDomains',
    title: 'دامنه های مجاز',
    width: 120,
  },
  {
    field: 'startDate',
    title: 'تاریخ شروع',
    width: 120,
  },
  {
    field: 'endDate',
    title: 'تاریخ پایان',
    width: 120,
  },
  {
    field: 'managerUserFullName',
    title: 'تاریخ پایان',
    width: 200,
    sortable: true,
  },
  {
    field: 'officeName',
    title: 'نام دفتر',
    width: 200,
    sortable: true,
  },
  {
    field: 'officeAddress',
    title: 'آدرس دفتر',
    width: 200,
    sortable: true,
  },
  {
    field: 'officeTell',
    title: 'تلفن دفتر',
    width: 120,
  },
  {
    field: 'officeFax',
    title: 'دورنگار دفتر',
    width: 120,
  },
  {
    field: 'longitude',
    title: 'طول جغرافیایی',
    width: 70,
  },
  {
    field: 'latitude',
    title: 'عرض جغرافیایی',
    width: 70,
  },
  {
    field: 'altitude',
    title: 'ارتفاع از سطح دریا',
    width: 70,
  },
  {
    field: 'nosaziCode',
    title: 'کد نوسازی',
    width: 100,
  },
  {
    field: 'comment',
    title: 'توضیحات',
    width: 200,
  },
];

async function load(opt: IGridLoadEventParams) {
  try {
    state.loading = true;
    const { hasError, dd } = await api.post('/v2/job-locations/list-job-location', {
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
