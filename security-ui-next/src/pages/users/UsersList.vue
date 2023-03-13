<template>
  <base-page
    title="لیست کاربران"
    :loading="state.loading"
  >
    <base-grid
      key-field="NidUser"
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
import { useRoute, useRouter } from 'vue-router';
import { useLogger } from '../../composition/use-logger';
import { IGridColumn } from '../../definitions/IGridColumn';
import { IGridLoadEventParams } from '../../definitions/IGridLoadEventParams';

const api = useApi();
const route = useRoute();
const router = useRouter();
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
    // cell: 'base-user',
    props: { onlineStatus: true },
  },
  {
    field: 'username',
    title: 'نام کاربری',
    width: 120,
    style: {
      textAlign: 'start',
      justifyContent: 'start',
    },
    sortable: true,
  },
  {
    field: 'firstName',
    title: 'نام',
    width: 120,
    sortable: true,
  },
  {
    field: 'lastName',
    title: 'نام خانوادگی',
    width: 120,
    sortable: true,
  },
  {
    field: 'email',
    title: 'ایمیل',
    width: 180,
  },
  {
    field: 'enabled',
    title: 'فعال',
    width: 60,
    // cell: 'base-boolean',
  },
  {
    field: 'lastLoginDate',
    title: 'آخرین ورود',
    width: 120,
  },
  {
    field: 'jobLocation',
    title: 'محل خدمت',
    width: 200,
    mapper: 'jobLocation.name',
  },
  {
    field: 'domain',
    title: 'دامنه',
    width: 200,
    // filter: 'domain-list',
  },
  {
    field: 'IDNumber',
    title: 'کد ملی',
    width: 150,
  },
  {
    field: 'tel',
    title: 'تلفن',
    width: 200,
  },
  {
    field: 'mobile',
    title: 'تلفن همراه',
    width: 200,
    filter: 'mobile',
  },
  {
    field: 'birthDate',
    title: 'تاریخ تولد',
    width: 200,
  },
  {
    field: 'fatherName',
    title: 'نام پدر',
    width: 200,
  },
  {
    field: 'birthPlace',
    title: 'محل تولد',
    width: 200,
  },
  {
    field: 'description',
    title: 'توضیحات',
    width: 300,
  },
  {
    field: 'address',
    title: 'آدرس',
    width: 300,
  },
  {
    field: 'allowedIP',
    title: 'آی پی مجاز',
    width: 100,
  },
  {
    field: 'isSysAdmin',
    title: 'مدیر است؟',
    width: 100,
    cell: 'base-boolean',
  },
  {
    field: 'isSysApp',
    title: 'مدیر اپ است؟',
    width: 100,
    cell: 'base-boolean',
  },
  {
    field: 'isSys3rdParty',
    title: 'مدیر 3rd Party است؟',
    width: 100,
    cell: 'base-boolean',
  },
  {
    field: 'startActiveDate',
    title: 'تاریخ شروع فعالیت',
    width: 180,
    filter: 'date',
  },
  {
    field: 'endActiveDate',
    title: 'تاریخ پایان فعالیت',
    width: 180,
    filter: 'date',
  },
  {
    field: 'sessionTimeout',
    title: 'طول عمر نشست (دقیقه)',
    width: 120,
  },
  {
    field: 'mustChangePassword',
    title: 'الزام تغییر گذرواژه',
    width: 180,
    cell: 'base-boolean',
  },
  {
    field: 'changePasswordDate',
    title: 'تاریخ تغییر گذرواژه',
    width: 180,
    filter: 'date',
  },
  {
    field: 'userCreator',
    title: 'کاربر ایجاد کننده',
    width: 200,
    filter: 'user',
  },
  {
    field: 'createdAt',
    title: 'تاریخ ایجاد',
    width: 180,
    filter: 'datetime',
  },
  {
    field: 'updatedAt',
    title: 'تاریخ بروزرسانی',
    width: 180,
    filter: 'datetime',
  },
];

async function load(opt: IGridLoadEventParams) {
  try {
    state.loading = true;
    const { hasError, dd } = await api.post('/v2/users/user-list', {
      from: opt.from,
      to: opt.to,
      search: opt.search,
      filter: opt.filter,
      populate: true,
      banned: route.query.banned ? true : undefined,
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

async function selectedRow(row: any) {
  try {
    state.loading = true;
    await router.push({ name: 'UserInfo', params: { id: row.NidUser } });
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loading = false;
  }
}
</script>
