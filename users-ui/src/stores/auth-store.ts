import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';

interface IUser {
  readonly NidUser: string;
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly domain: Array<string>;
}

interface ISession {
  user?: IUser;
  token?: string;
  expiryDate?: Date
  hasActiveSession?: boolean,
}

export const useAuthStore = defineStore('authStore', () => {
  const session = reactive({
    token: undefined,
    user: undefined,
    expiryDate: undefined,
    hasActiveSession: undefined,
  } as ISession);

  const isLoggedIn = computed(() => !!session.user && !!session.token);
  const isAdmin0 = computed(() => !!session.user?.domain?.includes('0'));

  function setSession(userSession: ISession) {
    session.user = userSession.user;
    session.token = userSession.token;
    session.expiryDate = userSession.expiryDate;
    session.hasActiveSession = userSession.hasActiveSession;
  }

  function clearSession() {
    session.user = undefined;
    session.token = undefined;
    session.expiryDate = undefined;
    session.hasActiveSession = undefined;
  }

  return {
    session,
    isAdmin0,
    isLoggedIn,
    setSession,
    clearSession,
  };
});
