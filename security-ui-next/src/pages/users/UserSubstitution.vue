<template xmlns:div="http://www.w3.org/1999/html">
  <base-layout :loading="state.loadingCount">
    <div class="w-full grid grid-cols-8 gap-2">
      <div class="col-span-full md:col-span-3 lg:col-span-5">
        <base-grid
          searchable
          style="height: 82vh"
          key-field="NidUser"
          title="انتخاب کاربر جایگزین"
          :total-records="state.usersTotalRecords"
          :columns="usersColumns"
          v-model="state.usersList"
          v-model:selected="state.selectedUser"
          @load="load"
        />
      </div>
      <div class="flex flex-col col-span-full md:col-span-5 lg:col-span-3 bg-white border rounded p-2">
        <div class="mb-2">
          تنظیم زمان جانشین
        </div>
        <base-form
          class="grid grid-cols-1 gap-4 my-2"
          @submit="save"
        >
          <base-text-box
            readonly
            required
            label="کاربر جانشین"
            placeholder="انتخاب نشده"
            :model-value="userDisplay"
          />
          <base-calendar
            required
            allow-time
            allow-holidays
            label="زمان شروع"
            v-model="dm.StartDate"
          />
          <base-calendar
            required
            allow-time
            allow-holidays
            label="زمان پایان"
            v-model="dm.EndDate"
          />
          <base-text-box
            type="textarea"
            label="توضیحات"
            v-model="dm.Description"
          />
          <base-button
            primary
            icon="fa-save"
            label="ثبت"
          />
        </base-form>
        <base-grid
          hide-pagination
          class="h-48 md:h-full mt-4"
          key-field="NidSubstitute"
          title="لیست کاربران جانشین شده از قبل"
          :columns="histColumns"
          :total-records="state.histTotalRecords"
          v-model="state.histList"
          @load="loadHist"
        />
      </div>
    </div>
  </base-layout>
</template>

<script setup lang="ts">

import { computed, reactive } from 'vue';
import { IUserModel } from '../../definitions/IUserModel';
import { ISubstitutionModel } from '../../definitions/ISubstitutionModel';
import { IGridLoadEventParams } from '../../definitions/IGridLoadEventParams';
import { useApi } from '../../composition/use-api';
import { useRoute } from 'vue-router';
import { useLogger } from '../../composition/use-logger';
import { IGridColumn } from '../../definitions/IGridColumn';
import { useFilters } from '../../composition/use-filters';

const api = useApi();
const route = useRoute();
const logger = useLogger();
const filters = useFilters();

const givenId = computed(() => route.params.id as string);
const usersColumns: Array<IGridColumn> = [
  {
    field: 'img',
    title: 'تصویر',
    width: 70,
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
    filterable: true,
  },
  {
    field: 'firstName',
    title: 'نام',
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    field: 'lastName',
    title: 'نام خانوادگی',
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    field: 'enabled',
    title: 'فعال',
    width: 80,
    type: 'boolean',
    filterable: true,
  },
  {
    field: 'email',
    title: 'ایمیل',
    width: 180,
    filterable: true,
  },
  {
    field: 'jobLocation.name',
    title: 'محل خدمت',
    width: 200,
  },
  {
    field: 'IDNumber',
    title: 'کد ملی',
    width: 150,
    filterable: true,
  },
  {
    field: 'tel',
    title: 'تلفن',
    width: 200,
    filterable: true,
  },
  {
    field: 'mobile',
    title: 'تلفن همراه',
    width: 200,
    filter: 'mobile',
    filterable: true,
  },
  {
    field: 'fatherName',
    title: 'نام پدر',
    width: 200,
    filterable: true,
  },
];
const histColumns: Array<IGridColumn> = [
  {
    field: 'targetUser',
    title: 'تصویر',
    width: 70,
    cell: 'base-avatar',
  },
  {
    field: 'targetUser',
    title: 'جانشین',
    filter: 'user',
    width: 300,
    sortable: true,
  },
  {
    field: 'isActive',
    title: 'فعال بودن',
    width: 60,
    cell: 'base-boolean',
  },
  {
    field: 'StartDate',
    title: 'از تاریخ',
    width: 150,
    sortable: true,
    filter: 'datetime',
  },
  {
    field: 'EndDate',
    title: 'تا تاریخ',
    width: 150,
    filter: 'datetime',
  },
  {
    field: 'Description',
    title: 'توضیحات',
    width: 300,
  },
  {
    field: 'userCreator',
    title: 'ایجاد کننده',
    width: 200,
    filter: 'user',
  },
  {
    field: 'createdAt',
    title: 'ایجاد',
    width: 200,
    filter: 'datetime',
  },
  {
    field: 'updatedAt',
    title: 'بروزرسانی',
    width: 200,
    filter: 'datetime',
  },
  {
    field: 'actions',
    title: 'عملیات',
    width: 80,
  },
];

const state = reactive({
  loadingCount: 0,
  usersList: [] as Array<Partial<IUserModel>>,
  selectedUser: {} as Partial<IUserModel>,
  usersTotalRecords: 0,
  histList: [] as Array<ISubstitutionModel>,
  histTotalRecords: 0,
});
const dm = reactive({
  NidUser: '',
  StartDate: '',
  EndDate: '',
  Description: '',
} as ISubstitutionModel);

const userDisplay = computed(() => {
  if (!state.selectedUser?.NidUser) {
    return '';
  }
  return filters.user(state.selectedUser);
});

async function load(opt: IGridLoadEventParams) {
  try {
    state.loadingCount += 1;
    const { dd, hasError } = await api.post('/v2/users/user-list', {
      from: opt.from,
      to: opt.to,
      search: opt.search,
      filter: opt.filter,
    });
    if (hasError) {
      return;
    }
    state.usersList = dd.list || [];
    state.usersTotalRecords = dd.total || 0;
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loadingCount -= 1;
  }
}

async function loadHist(opt: IGridLoadEventParams) {
  try {
    state.loadingCount += 1;
    const { dd, hasError } = await api.post('/v2/users/substituted-list', {
      from: opt.from,
      to: opt.to,
      search: opt.search,
      NidUser: givenId.value,
      populate: true,
      history: true,
      reverse: false,
    });
    if (hasError) {
      return;
    }
    state.histList = dd.list || [];
    state.histTotalRecords = dd.total || 0;
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loadingCount -= 1;
  }
}

async function save() {
  try {
    state.loadingCount += 1;
    const { hasError } = await api.post('/users/add-substitution', {
      NidSubstitute: state.selectedUser?.NidUser,
      StartDate: dm.StartDate,
      EndDate: dm.EndDate,
      Description: dm.Description,
      NidUser: givenId.value,
    });
    if (hasError) {
      return;
    }
    await load({ from: 1, to: 20, search: '' } as IGridLoadEventParams);
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loadingCount -= 1;
  }
}

</script>
