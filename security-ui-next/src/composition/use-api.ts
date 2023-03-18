import axios, { AxiosResponse } from 'axios';
import { useConf } from './use-conf';
import { useAuthStore } from '../stores/auth-store';
import { IMessage, useNotifyStore } from '../stores/notify-store';

interface IApiCallOptions {
  params?: any | undefined;
  headers?: any | undefined;
  silent?: boolean | undefined;
  cancellable?: boolean | undefined;
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
  const notifyStore = useNotifyStore();

  const baseURL = /^http/i.test(service)
    ? service
    : conf.get(`${ service }ServiceURL`, conf.get(service, '') ?? '') ?? '';
  if (!baseURL) {
    notifyStore.error('cannot useApi invalid baseURL: ' + service);
    throw new Error('cannot useApi invalid baseURL: ' + service);
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
        };
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

  async function post(path: string, payload: object, options: IApiCallOptions = {} as IApiCallOptions): Promise<IApiResponse> {
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
    cleanCancellationUp(cancellationKey);
    if (options.silent !== false) {
      res.messages.forEach(x => notifyStore.addMessage(x.type, x.message));
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
    cleanCancellationUp(cancellationKey);
    if (options.silent !== false) {
      res.messages.forEach(x => notifyStore.addMessage(x.type, x.message));
    }
    return res;
  }

  async function download(path: string, payload: object, fileName: string = 'exported-list.csv') {
    const response = await api.post(path, {
      asFile: true,
      ...payload
    }, {
      headers: {
        token: session.token,
        domain: session.currentDomain,
      },
    });
    const url = window.URL.createObjectURL(new Blob([ response.data ]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function upload(path: string, fieldName: string = 'list', accept: string = '.csv') {
    return new Promise((resolve, reject) => {
      try {
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'file');
        inputElement.setAttribute('accept', accept);
        inputElement.setAttribute('hidden', 'true');
        inputElement.onchange = ev => {
          // @ts-ignore
          const file = ev.target.files[0];
          if (file) {
            const formData = new FormData();
            formData.append(fieldName, file);
            return api
              .post(path, formData, {
                headers: {
                  token: session.token,
                  domain: session.currentDomain,
                }
              })
              .catch(reject)
              .then(() => resolve({ done: true }))
              .finally(() => document.body.removeChild(inputElement));
          } else {
            resolve({ cancelled: true });
          }
        };
        document.body.appendChild(inputElement);
        inputElement.click();
      } catch (e) {
        reject(e);
      }
    });
  }

  return {
    post,
    get,
    upload,
    download,
  };
}
