<template>
  <base-layout :loading="state.loadingCount">
    <div class="w-full grid grid-cols-9">
      <div class="col-span-full md:col-span-4">
        <base-grid
          multiple
          style="height: 80vh"
          key-field="NidGroup"
          :total-records="state.aTotalRecord"
          :columns="aColumns"
          v-model="state.aList"
          v-model:selected="state.aSelected"
          @load="loadA"
        />
      </div>
      <div class="col-span-full md:col-span-1 flex md:flex-col items-center justify-center" style="min-height: 60px">
        <base-button
          icon="fa-arrow-left"
          class="text-primary m-1 fa-rotate-270 md:rotate-0"
          :disabled="!allowA"
          @click="add"
        >
        </base-button>
        <base-button
          icon="fa-arrow-right"
          class="text-primary m-1 fa-rotate-270 md:rotate-0"
          :disabled="!allowR"
          @click="remove"
        >
        </base-button>
      </div>
      <div class="col-span-full md:col-span-4">
        <base-grid
          multiple
          style="height: 80vh"
          key-field="NidGroup"
          :columns="rColumns"
          :total-records="state.rTotalRecord"
          v-model="state.rList"
          v-model:selected="state.rSelected"
          @load="loadR"
        />
      </div>
    </div>
  </base-layout>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { IGridLoadEventParams } from '../../definitions/IGridLoadEventParams';
import { useLogger } from '../../composition/use-logger';
import { useRoute } from 'vue-router';
import { useApi } from '../../composition/use-api';
import { IGroupRoleModel } from '../../definitions/IGroupRoleModel';

const api = useApi();
const route = useRoute();
const logger = useLogger();

const givenId = computed(() => route.params.id as string);

const state = reactive({
  loadingCount: 0,
  aList: [] as Array<Partial<IGroupRoleModel>>,
  aSelected: [] as Array<Partial<IGroupRoleModel>>,
  aTotalRecord: 0,
  rList: [] as Array<Partial<IGroupRoleModel>>,
  rSelected: [] as Array<Partial<IGroupRoleModel>>,
  rTotalRecord: 0,
});

const aColumns = [
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
    field: 'createdAt',
    title: 'ایجاد',
    width: 180,
    filter: 'datetime',
  },
];
const rColumns = [
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
    field: 'assignedBy',
    title: 'تخصیص یافته توسط',
    width: 200,
    filter: 'user',
  },
  {
    field: 'label',
    title: 'سمت سازمانی',
    width: 100,
    sortable: true,
  },
];

const allowA = computed(() => state.aSelected.length > 0);
const allowR = computed(() => state.rSelected.length > 0);

async function loadA(opt: IGridLoadEventParams) {
  try {
    state.loadingCount += 1;
    const { dd, hasError } = await api.post('/v2/groups/group-list', {
      from: opt.from,
      to: opt.to,
      search: opt.search,
      NidUser: givenId.value,
      reverse: true,
      populate: false,
    }, { cancellable: false });
    if (hasError) {
      return;
    }
    state.aList = dd.list || [];
    state.aTotalRecord = dd.total || 0;
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loadingCount -= 1;
  }
}

async function loadR(opt: IGridLoadEventParams) {
  try {
    state.loadingCount += 1;
    const { dd, hasError } = await api.post('/v2/groups/group-list', {
      from: opt.from,
      to: opt.to,
      search: opt.search,
      NidUser: givenId.value,
      reverse: false,
      populate: true,
    }, { cancellable: false });
    if (hasError) {
      return;
    }
    state.rList = dd.list || [];
    state.rTotalRecord = dd.total || 0;
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loadingCount -= 1;
  }
}

function reload() {
  state.aSelected = [];
  state.rSelected = [];
  loadA({ from: 1, to: 20, search: '' } as IGridLoadEventParams);
  loadR({ from: 1, to: 20, search: '' } as IGridLoadEventParams);
}

async function add() {
  try {
    state.loadingCount += 1;
    const { hasError } = await api.post('/v2/users/group-allocate', {
      NidUsers: [ givenId.value ],
      NidGroups: state.aSelected.map(x => x.NidGroup),
    });
    if (hasError) {
      return;
    }
    reload();
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loadingCount -= 1;
  }
}

async function remove() {
  try {
    state.loadingCount += 1;
    const { hasError } = await api.post('/v2/users/group-deallocate', {
      NidUsers: [ givenId.value ],
      NidGroups: state.rSelected.map(x => x.NidGroup),
    });
    if (hasError) {
      return;
    }
    reload();
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loadingCount -= 1;
  }
}

</script>
