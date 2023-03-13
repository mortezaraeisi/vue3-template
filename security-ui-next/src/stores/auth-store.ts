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
  loginByAccessToken?: boolean,
  currentDomain?: string
}

export const useAuthStore = defineStore('authStore', () => {
  const session = reactive({
    token: undefined,
    user: undefined,
    expiryDate: undefined,
    hasActiveSession: undefined,
    loginByAccessToken: undefined,
  } as ISession);

  const isLoggedIn = computed(() => !!session.user && !!session.token);
  const isAdmin0 = computed(() => !!session.user?.domain?.includes('0'));
  const displayName = computed(() => !isLoggedIn
    ? 'no-login'
    : `${ session.user?.firstName } ${ session.user?.lastName }`);
  const fullName = computed(() => !isLoggedIn
    ? 'no-login'
    : `${ session.user?.firstName } ${ session.user?.lastName } (${ session.user?.username })`);

  function setSession(userSession: ISession) {
    session.user = userSession.user;
    session.token = userSession.token;
    session.expiryDate = userSession.expiryDate;
    session.hasActiveSession = userSession.hasActiveSession;
    session.loginByAccessToken = userSession.loginByAccessToken;
    setCurrentDomain(userSession.user?.domain[0] ?? '1')
  }

  function setCurrentDomain(domain: string) {
    session.currentDomain = domain;
  }

  function clearSession() {
    session.user = undefined;
    session.token = undefined;
    session.expiryDate = undefined;
    session.hasActiveSession = undefined;
    session.loginByAccessToken = undefined;
    session.currentDomain = undefined;
  }

  return {
    session,
    isAdmin0,
    isLoggedIn,
    setSession,
    clearSession,
    displayName,
    fullName,
  };
});
