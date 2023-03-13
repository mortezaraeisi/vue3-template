<template>
  <section class="w-full h-full flex items-center justify-center">
    <div class="basis-full md:basis-3/4 xl:basis-1/3 border rounded flex-row md:flex ">
      <div class="basis-full md:basis-1/2 self-stretch p-4 grid grid-cols-1 gap-1">
        <div>
          <div class="text-xl">
            ورود کاربران
          </div>
        </div>
        <base-form
          autofocus
          class="grid grid-cols-1 gap-1"
          @submit="login"
        >
          <div class="text-sm mb-1">
            ورود کاربران
          </div>
          <base-text-box
            required
            label="نام کاربری"
            v-model="dm.username"
          />
          <base-text-box
            required
            type="password"
            label="گذرواژه"
            v-model="dm.password"
          />
          <base-button
            primary
            type="submit"
            label="ورود"
            :loading="dm.loading"
          />
        </base-form>
      </div>
      <div class="basis-full md:basis-1/2">
        <img src="images/login.png" class="w-fit h-fit bg-contain"/>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '../../composition/use-api';
import { useAuthStore } from '../../stores/auth-store';

const userStore = useAuthStore();
const router = useRouter();

const api = useApi('security');
const dm = ref({
  loading: false,
  username: '',
  password: '',
  rememberMe: false,
});

async function setSession({ token = '', expiryDate = undefined, hasActiveSession = false }) {
  try {
    const { hasError, dd } = await api.post('/v2/users/my-info', {}, {
      headers: {
        token
      }
    });
    if (hasError) {
      return;
    }
    userStore.setSession({ token, user: dd, expiryDate, hasActiveSession });
    await router.replace({ name: 'Dashboard' });
  } catch (e) {
    console.error('ff', e);
  }
}

async function login() {
  try {
    dm.value.loading = true;
    const { hasError, dd } = await api.post('/v2/auth/login-by-passkey', {
      username: dm.value.username,
      password: dm.value.password,
      includeURG: false,
      subSystem: 'SecurityUI',
    });
    if (hasError) {
      return;
    }
    await setSession({
      token: dd.token,
      expiryDate: dd.expiryDate,
      hasActiveSession: dd.hasActiveSession,
    });
  } catch (e) {
    console.error(e);
  } finally {
    dm.value.loading = false;
  }
}
</script>
