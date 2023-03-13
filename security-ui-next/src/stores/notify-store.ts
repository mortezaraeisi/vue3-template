import { defineStore } from "pinia";
import { computed, reactive } from "vue";

type MessageTypes = 'error' | 'warning' | 'info' | 'confirm';

export interface IMessage {
  type: MessageTypes,
  message: string,
}

interface IHandler {
  onCancel(cb: Function): IHandler,

  onOk(cb: Function): IHandler,
}

class Handler implements IHandler {
  private _okCb?: Function = undefined;
  private _cancelCb?: Function = undefined;

  public onOk(cb: Function) {
    this._okCb = cb;
    return this;
  }

  public onCancel(cb: Function) {
    this._cancelCb = cb;
    return this;
  }

  public invokeOk(...args: Array<any>) {
    if (this._okCb) {
      this._okCb(...args)
    }
  }

  public invokeCancel(...args: Array<any>) {
    if (this._cancelCb) {
      this._cancelCb(...args)
    }
  }

}

export interface IMessageItem {
  id: number,
  type: MessageTypes,
  message: string,
  icon: string,
  title: string,
  color: string,
  handler: Handler,
}

interface IUiStore {
  message: Array<IMessageItem>
}

const MSG_DEF = {
  error: {
    icon: 'fa-circle-exclamation',
    title: 'خطا',
    color: 'red',
  },
  warning: {
    icon: 'fa-triangle-exclamation',
    title: 'هشدار',
    color: 'yellow'
  },
  info: {
    icon: 'fa-circle-info',
    title: 'توجه',
    color: 'blue',
  },
  confirm: {
    icon: 'fa-circle-question',
    title: 'توجه',
    color: 'blue',
  },
}

export const useNotifyStore = defineStore('notifyStore', () => {
  let msgId = 0;
  const state = reactive({
    message: []
  } as IUiStore)

  function addMessage(type: MessageTypes, message: string): IHandler {
    const handler = new Handler();
    state.message.push({ ...MSG_DEF[type], id: ++msgId, type, message, handler })
    return handler
  }

  function error(message: string): IHandler {
    return addMessage("error", message)
  }

  function warning(message: string): IHandler {
    return addMessage("warning", message)
  }

  function info(message: string): IHandler {
    return addMessage("info", message)
  }

  function confirm(message: string): IHandler {
    return addMessage("confirm", message)
  }

  function close(id: Number, isConfirmed?: boolean) {
    const msg = state.message.find(x => x.id === id)
    if (msg) {
      state.message = state.message.filter(x => x.id !== id);
      if (isConfirmed) {
        msg.handler.invokeOk();
      } else {
        msg.handler.invokeCancel();
      }
    }
  }

  return {
    state,
    error,
    warning,
    info,
    confirm,
    addMessage,
    close,
    messages: computed(() => state.message)
  }
})
