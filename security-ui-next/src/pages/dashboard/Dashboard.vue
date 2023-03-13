<template>
  <base-page
    title="داشبورد"
  >
    <div class="flex flex-wrap">
      <div
        v-for="(counter, i) in state.counters" :key="i"
        class="flex justify-between items-center p-2 basis-full sm:flex-1 m-0.5 bg-white hover:bg-blue-100 cursor-pointer shadow border rounded"
        @click="openCounter(counter.to)"
      >
        <div>
          <div class="text-normal">
            {{ counter.title }}
          </div>
          <div>
            {{ counter.value }}
          </div>
        </div>
        <div class="text-normal opacity-70">
          <base-icon :name="counter.icon" style="font-size: 26px;"/>
        </div>
      </div>
    </div>
    <div class="mt-4 shadow border bg-white rounded p-2">
      <div class="text-blue-800 font-bold">
        سابقه ورود
      </div>
      <div class="flex justify-end items-center text-normal">
        <select v-model="state.mode.by" @change="loadChart">
          <option value="day">روزانه</option>
          <option value="month">ماهیانه</option>
          <option value="year">سالیانه</option>
        </select>
        <div
          class="cursor-pointer mx-2 text-blue-800"
          title="جزئیات"
          @click="openAuthDetails"
        >
          <base-icon name="fa-clock-rotate-left"/>
        </div>
        <div class="mx-2.5"></div>
      </div>
      <div>
        <canvas id="authSummaryChart" style="width: 100%; height: 400px; max-height: 400px;"></canvas>
      </div>
    </div>
  </base-page>
</template>

<script setup lang="ts">

import Chart from 'chart.js/auto';
import { nextTick, onMounted, reactive, watch } from 'vue';
import { useApi } from '../../composition/use-api';
import { useConf } from '../../composition/use-conf';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth-store';
import { useLogger } from '../../composition/use-logger';

const api = useApi();
const conf = useConf();
const router = useRouter();
const logger = useLogger();
const authStore = useAuthStore();
const state = reactive({
  counters: [] as Array<any>,
  mode: {
    by: 'day',
    from: 1,
    to: 30,
    filter: [],
  },
  chartObj: undefined as any,
});

onMounted(() => load());

watch(() => authStore.session.currentDomain, load);

async function load() {
  try {
    nextTick(() => {
      loadChart();
    });
    const { hasError, dd } = await api.post('/v2/common/dashboard-summary', {});
    if (hasError) {
      return;
    }
    state.counters = [
      {
        title: 'تعداد کاربران',
        value: dd.totalUsers,
        icon: 'user-friends',
        to: { name: 'UsersList' },
      },
      {
        title: 'تعداد اپلیکیشن ها',
        value: dd.totalWorkspaces,
        icon: 'mobile-alt',
        to: { name: 'workspaces' },
      },
      {
        title: 'کاربران آنلاین',
        value: dd.onlineUsers,
        query: 'online_user',
        icon: 'fa-house-signal',
        path: conf.get('socket.enabled', false) ? 'UOnlineUsersForm' : 'TabOnlineUsers',
        to: {
          name: conf.get('socket.enabled', false)
            ? 'onlineUsersSock'
            : 'onlineUsers',
        },
      },
      {
        title: 'کاربران غیرفعال',
        value: dd.inactiveUsers,
        query: 'banned_user',
        icon: 'fa-person-arrow-down-to-line',
        to: { name: 'UsersList', query: { banned: true } },
      },
    ];
  } catch (e) {
    logger.catchError(e, 'cannot load dashboard-summary');
  }
}

async function loadChart() {
  try {
    const { hasError, dd } = await api.post('/v2/auth/auth-history-summary', {
      ...state.mode
    });
    if (hasError) {
      return;
    }
    const lst: Array<any> = dd.list.reverse();
    lst[0].dateLabel = lst[0].date;
    for (let i = 1; i < lst.length; i += 1) {
      const dPrev = lst[i - 1].date || '';
      const dCurr = lst[i].date || '';
      lst[i].dateLabel = dCurr;
      if (dPrev.substr(0, 7) === dCurr.substr(0, 7)) {
        lst[i].dateLabel = dCurr.substr(5);
      }
    }
    if (state.chartObj) {
      state.chartObj.destroy();
      state.chartObj = null;
    }
    state.chartObj = new Chart('authSummaryChart', {
      type: 'line',
      data: {
        labels: lst.map(x => x.dateLabel),
        datasets: [
          {
            label: 'دیتای اشتباه',
            borderColor: '#5d0117',
            backgroundColor: '#5d0117',
            fill: false,
            data: lst.map(x => x.orphaned),
            order: 4,
          },
          {
            label: 'ناموفق',
            borderColor: '#FF7396',
            backgroundColor: '#FF7396',
            fill: false,
            data: lst.map(x => x.failure),
            order: 3,
          },
          {
            label: 'موفق',
            borderColor: '#3255F0',
            backgroundColor: '#3255F0',
            fill: false,
            data: lst.map(x => x.success),
            order: 2,
          },
          {
            label: 'تلاش',
            borderColor: '#41D9C0',
            backgroundColor: '#41D9C0',
            fill: false,
            data: lst.map(x => x.success + x.failure + x.orphaned),
            order: 1,
          },
          {
            label: 'تعدادکاربر',
            borderColor: '#001950',
            backgroundColor: '#001950',
            fill: false,
            data: lst.map(x => x.users),
            order: 5,
          },
          {
            label: 'تعداد برنامه',
            borderColor: '#4b3900',
            backgroundColor: '#4b3900',
            fill: false,
            data: lst.map(x => x.apps),
            order: 6,
          },
        ],
      },
      options: {
        animations: {
          tension: {
            duration: 1000,
            easing: 'easeInOutElastic',
            from: 0,
            to: 0.4,
            loop: false,
          },
        },
        devicePixelRatio: 1,
        locale: 'fa-IR',
        interaction: {
          mode: 'index',
        },
        plugins: {
          legend: {
            labels: {
              font: {
                family: 'Yekan'
              }
            },
            display: true,
          },
        },
        scales: {
          x: {
            display: true,
          },
          y: {
            grid: {
              color: 'rgba(229, 229, 229, 0.75)',
            },
          },
        },
      },
    });
  } catch (e) {
    logger.catchError(e, 'cannot load charts');
  }
}

function openCounter(to: any) {
  router.push(to);
}

function openAuthDetails() {
  router.push({ name: 'authHistory' });
}
</script>
