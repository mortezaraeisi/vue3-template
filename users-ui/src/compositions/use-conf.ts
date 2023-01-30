interface IConf {
  readonly securityURL: string;
  readonly securityWs: string;
}

let conf: IConf;

export function useConf(): IConf {
  if (!conf) {
    // eslint-disable-next-line no-undef
    conf = settings as IConf;
  }

  return conf;
}
