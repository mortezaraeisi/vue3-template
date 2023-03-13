import axios, { AxiosResponse } from 'axios';
import { useConf } from './use-conf';
import { useAuthStore } from '../stores/auth-store';
import { IMessage, useNotifyStore } from '../stores/notify-store';

interface IApiCallOptions {
  params?: any | undefined
  headers?: any | undefined
  silent?: boolean | undefined
  cancellable?: boolean | undefined
}

interface IApiResponse {
  hasError: boolean
  messages: Array<IMessage>,
  data?: any,
  dd?: any,
}

export function useApi(service: string = 'security') {
  const conf = useConf();
  const { session } = useAuthStore();
  const notifyStore = useNotifyStore()

  const baseURL = /^http/i.test(service)
    ? service
    : conf.get(`${ service }ServiceURL`, conf.get(service, '') ?? '') ?? '';
  if (!baseURL) {
    notifyStore.error('cannot useApi invalid baseURL: ' + service)
    throw new Error('cannot useApi invalid baseURL: ' + service)
  }
  const api = axios.create({ baseURL });
  const cancelTokens = new Map<string, any>();

  function takeCareOfCancellation(key: string) {
    const cancelToken = cancelTokens.get(key);
    if (cancelToken) {
      cancelToken.cancel();
    }
    cancelTokens.set(key, axios.CancelToken.source().token);
    return cancelTokens.get(key);
  }

  function cleanCancellationUp(key: string) {
    cancelTokens.delete(key);
  }

  async function makeTheCall(promise: Promise<AxiosResponse<any>>): Promise<IApiResponse> {
    let resp: AxiosResponse<any>;
    const messages: Array<IMessage> = [];
    try {
      resp = await promise;
      if (resp.data.success === false) {
        messages.push({
          type: 'error',
          message: resp.data.msg ?? '',
        });
      }
      return {
        messages,
        hasError: messages.some(x => x.type === 'error'),
        data: resp.data,
        dd: resp.data?.data,
      };
    } catch (e: any) {
      if (axios.isCancel(e)) {
        return {
          hasError: true,
          messages: [] as Array<IMessage>,
        }
      }
      messages.push({
        type: 'error',
        message: e.message,
      });
      return {
        messages,
        hasError: messages.some(x => x.type === 'error'),
      };
    }
  }

  async function post(path: string, payload: any, options: IApiCallOptions = {} as IApiCallOptions): Promise<IApiResponse> {
    const cancellationKey = `post-${ path }`;
    const cancelToken = options.cancellable !== false ? takeCareOfCancellation(cancellationKey) : undefined;
    let promise = api.post(path, payload, {
      params: options.params,
      headers: {
        token: session.token,
        domain: session.currentDomain,
        ...options.headers,
      },
      cancelToken,
    });
    const res = await makeTheCall(promise);
    cleanCancellationUp(cancellationKey)
    if (options.silent !== false) {
      res.messages.forEach(x => notifyStore.addMessage(x.type, x.message))
    }
    return res;
  }

  async function get(path: string, options: IApiCallOptions = {} as IApiCallOptions): Promise<IApiResponse> {
    const cancellationKey = `get-${ path }`;
    const cancelToken = options.cancellable !== false ? takeCareOfCancellation(cancellationKey) : undefined;
    const promise = api.get(path, {
      params: options.params,
      headers: {
        token: session.token,
        domain: session.currentDomain,
        ...options.headers,
      },
      cancelToken,
    });
    const res = await makeTheCall(promise);
    cleanCancellationUp(cancellationKey)
    if (options.silent !== false) {
      res.messages.forEach(x => notifyStore.addMessage(x.type, x.message))
    }
    return res;
  }

  async function download() {
  }

  async function upload() {
  }

  return {
    post,
    get,
    upload,
    download,
  };
}
