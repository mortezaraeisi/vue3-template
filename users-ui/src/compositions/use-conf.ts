interface IConf {
  readonly securityURL: string;
  readonly securityWs: string;
}

declare const settings: object;

let conf: IConf;

export function useConf(): IConf {
  if (!conf) {
    conf = settings as IConf;
  }

  return conf;
}
