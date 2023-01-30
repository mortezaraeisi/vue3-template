import { useConf } from 'src/compositions/use-conf';
import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from 'stores/auth-store';

enum Services {
  Security = 'securityURL'
}

interface IApiResult {
  readonly success: boolean;
  readonly data?: any;
  readonly dd?: any;
}

export function useApi(serviceName: Services) {
  const conf = useConf();
  const baseURL = conf[serviceName];
  const { session } = useAuthStore();

  const api = axios.create({
    baseURL,
    headers: {
      token: session.token,
    },
  });

  async function post(path: string, payload?: any, cfg?: AxiosRequestConfig): Promise<IApiResult> {
    try {
      const resp = await api.post(path, payload, cfg);
      return {
        success: resp.data?.success,
        data: resp.data,
        dd: resp.data?.data,
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
      };
    }
  }

  return {
    post,
  };
}
