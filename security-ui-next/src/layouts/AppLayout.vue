<template>
  <section class="flex h-screen w-screen">
    <div
      class="basis-auto flex flex-col p-1 bg-primary dark:bg-red-800 text-white"
      style="width: 50px; min-width: 50px;"
    >
      <img
        class="w-12 mb-5 mt-2"
        src="images/company-logo.png"
      >
      <div
        v-for="mnu in menuItems" :key="mnu.title"
        class="flex justify-center my-1 cursor-pointer"
        @click.stop="sidebarClick(mnu)"
      >
        <div class="" :title="mnu.title">
          <base-icon :name="mnu.icon"/>
        </div>
      </div>
    </div>
    <div class="basis-full flex flex-col flex-nowrap">
      <div class="basis-auto" style="height: 50px;">
        <div class="h-full flex justify-between p-3">
          <div></div>
          <div class="flex items-center text-sm">
            {{ displayName }}
          </div>
        </div>
      </div>
      <div class="flex-1">
        <router-view/>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth-store';
import { useNotifyStore } from '../stores/notify-store';

const route = useRoute();
const router = useRouter();
const notify = useNotifyStore();
const { isAdmin0, displayName, session, clearSession } = useAuthStore();

const menuItems = computed(() => {
  const menuItems = [
    {
      path: 'FormDashboard',
      icon: 'chart-line',
      title: 'داشبورد',
      link: '/dashboard',
    },
    {
      path: 'FormUsers',
      icon: 'user-friends',
      title: 'کاربران',
      link: { name: 'UsersList' },
    },
    {
      path: 'FormGroups',
      icon: 'users',
      title: 'گروها',
      link: { name: 'GroupsList' },
    },
    {
      path: 'FormWorkspaces',
      icon: 'mobile-alt',
      title: 'برنامه ها',
      link: { name: 'WorkspacesList' },
    },
    {
      path: 'FormResources',
      icon: 'archive',
      title: 'منابع',
      link: '/select-resource',
    },
    {
      path: 'FormReports',
      icon: 'print',
      title: 'گزارشات',
      link: '/select-report',
    },
    {
      path: 'FormLayers',
      icon: 'layer-group',
      title: 'لایه ها',
      link: '/select-layer',
    },
    {
      path: 'FormGrids',
      icon: 'th',
      title: 'تعاریف گرید ها',
      link: { name: 'GridsList' },
    },
    {
      path: 'FormGridPermission',
      icon: 'border-all',
      title: 'گریدها',
      link: '/select-grid',
    },
    {
      path: 'FormJobLocations',
      icon: 'street-view',
      title: 'محل های خدمت',
      link: { name: 'JobLocationList' },
    },
    {
      path: 'FormArchives',
      icon: 'file-archive',
      title: 'آرشیو',
      link: '/select-archive',
    },
    {
      path: 'FormWidget',
      icon: 'luggage-cart',
      title: 'ویجت',
      link: '/widgets',
    },
  ];
  if (isAdmin0) {
    menuItems.push({
      path: 'FormDomains',
      icon: 'globe',
      title: 'دامنه ها',
      link: { name: 'DomainsList' },
    });
    menuItems.push({
      path: 'apiManager',
      icon: 'route',
      title: 'مدیریت api',
      link: '/api-manager',
    });
  }

  if (!session.loginByAccessToken) {
    menuItems.push({
      path: 'sign-out',
      icon: 'sign-out-alt',
      title: 'خروج',
      link: 'sign-out',
    });
  }
  return menuItems.map(x => ({
    ...x,
    selected: route.fullPath.startsWith(x.link),
  }));
});

async function sidebarClick(mnu: any) {
  if (mnu.link === 'sign-out') {
    notify
      .confirm('آیا از خروج از سیستم اطمینان دارید؟')
      .onOk(() => {
        clearSession();
        router.replace({ name: 'Login' });
      })
    ;
  } else {
    await router.push(mnu.link);
  }

}
</script>
