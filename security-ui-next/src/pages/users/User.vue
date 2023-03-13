<template>
  <base-page
    title="کاربر"
    :loading="state.loading"
  >
    <template #header>
      <div class="flex">
        <a
          v-for="tab in tabs" :key="tab.name"
          href="javascript: void 0;"
          class="mx-1 text-sm text-normal hover:underline"
        >
          <base-icon :name="tab.icon"/>
          {{ tab.title }}
          /
        </a>
      </div>
    </template>
    <router-view
      v-if="!state.loading"
      :recordInfo="state.recordInfo"
    />
  </base-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { useLogger } from '../../composition/use-logger';
import { useApi } from '../../composition/use-api';

const api = useApi();
const route = useRoute();
const logger = useLogger();

const state = reactive({
  recordInfo: null,
  loading: false,
});
const tabs = [
  {
    name: 'info',
    title: 'اطلاعات',
    icon: 'fa-info-circle'
  },
  {
    name: 'groups',
    title: 'گروهها',
    icon: 'fa-people-group'
  },
  {
    name: 'substitution',
    title: 'جانشین',
    icon: 'fa-person-circle-exclamation'
  },
  {
    name: 'subsets',
    title: 'زیرمجموعه',
    icon: 'fa-diagram-project'
  },
  {
    name: 'domain',
    title: 'دامنه',
    icon: 'fa-globe'
  },
  {
    name: 'permissions',
    title: 'دسترسی',
    icon: 'fa-archive'
  },
  {
    name: 'job-location',
    title: 'محل خدمت',
    icon: 'fa-street-view'
  },
  {
    name: 'auth-history',
    title: 'احراز هویت',
    icon: 'fa-user-secret'
  },
];

async function load() {
  try {
    state.loading = true;
    const { hasError, dd } = await api.post('/users/get-userinfo', {
      NidUser: route.params.userId,
      populate: true,
    });
    if (hasError) {
      return;
    }
    state.recordInfo = dd;
  } catch (e) {
    logger.catchError(e);
  } finally {
    state.loading = false;
  }
}


onMounted(() => load());
</script>
