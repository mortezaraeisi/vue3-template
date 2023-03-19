<template>
  <base-page
    title="مشخصات کاربر"
    :loading="state.loading"
  >
    <template #header>
      <div>
        {{ display }}
      </div>
    </template>
    <div class="grid grid-cols-12 gap-1">
      <div class="col-span-1">
        <div class="grid grid-cols-1 gap-2">
          <a
            v-for="tab in tabs" :key="tab.target"
            href="javascript: void 0;"
            class="mx-1 text-sm text-normal hover:underline transition-all rounded p-1"
            :class="tab.classes"
            @click="navigate(tab.target)"
          >
            <base-icon :name="tab.icon"/>
            {{ tab.title }}
          </a>
        </div>
      </div>
      <div class="col-span-11">
        <router-view
          v-if="!state.loading"
          :recordInfo="state.recordInfo"
        />
      </div>
    </div>
  </base-page>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, reactive } from 'vue';
import { useLogger } from '../../composition/use-logger';
import { useApi } from '../../composition/use-api';
import { IUserModel } from '../../definitions/IUserModel';
import { useFilters } from '../../composition/use-filters';

const api = useApi();
const route = useRoute();
const router = useRouter();
const logger = useLogger();
const filters = useFilters();

const givenId = computed(() => route.params.id as string);
const display = computed(() => {
  if (state.loading) {
    return '...';
  }
  return filters.user(state.recordInfo);
});
const state = reactive({
  recordInfo: {} as IUserModel,
  loading: false,
});

const tabs = computed(() => {
  const tabs = [
    {
      target: 'UserInfo',
      title: 'اطلاعات',
      icon: 'fa-info-circle',
      route: 'info',
    },
    {
      target: 'UserMembership',
      title: 'گروهها',
      icon: 'fa-people-group',
      route: 'membership',
    },
    {
      target: 'UserSubstitution',
      title: 'جانشین',
      icon: 'fa-person-circle-exclamation',
      route: 'substitution',
    },
    {
      target: 'UserSubsets',
      title: 'زیرمجموعه',
      icon: 'fa-diagram-project',
      route: 'subsets',
    },
    {
      target: 'UserDomain',
      title: 'دامنه',
      icon: 'fa-globe',
      route: 'domain',
    },
    {
      target: 'UserPermissions',
      title: 'دسترسی',
      icon: 'fa-archive',
      route: 'permissions',
    },
    {
      target: 'UserJobLocation',
      title: 'محل خدمت',
      icon: 'fa-street-view',
      route: 'job-location',
    },
    {
      target: 'UserAuth',
      title: 'احراز هویت',
      icon: 'fa-user-secret',
      route: 'auth',
    },
  ]
    .map(x => ({
      ...x,
      classes: route.fullPath.endsWith(x.route) ? 'bg-white border-l-2 border-l-amber-400' : undefined
    }));
  return givenId.value === '0'
    ? [ tabs[0] ]
    : tabs;
});

async function load() {
  try {
    state.loading = true;
    const { hasError, dd } = await api.post('/users/get-userinfo', {
      NidUser: givenId.value,
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

function navigate(target: string) {
  router.push({ name: target, params: { userId: givenId.value } });
}

onMounted(() => load());
</script>
