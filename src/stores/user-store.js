import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null);
  const securityToken = ref('');

  const isLoggedIn = computed(() => !!currentUser.value && !!securityToken.value);
  const isAdmin = computed(() => isLoggedIn.value && !!currentUser.value.isAdmin);

  function setSession({ user, token }) {
    currentUser.value = user;
    securityToken.value = token;
  }

  return {
    isLoggedIn,
    isAdmin,
    setSession,
    currentUser,
    securityToken,
  };
});
