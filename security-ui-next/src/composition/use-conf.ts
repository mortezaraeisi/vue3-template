interface IConf {
  securityServiceURL: string
}

let conf: IConf = {} as IConf;

export function loadConf(confObj: any) {
  conf = JSON.parse(JSON.stringify({
    ...conf,
    ...confObj,
  })) as IConf;
}

export function getConf<T>(keyPath: string, defaultValue?: T): T | undefined {
  if (!keyPath.trim()) {
    throw new Error('keyPath must be a valid string.');
  }

  const keys = keyPath.split('.');
  const targetKey: string = keys.pop() ?? '';
  let current: any = conf;
  for (let i = 0; i < keys.length; i += 1) {
    current = current[keys[i]];
    if (!current) {
      if (arguments.length >= 2) {
        return defaultValue;
      }
      throw new Error(`Specified path not found. conf::${ keys.slice(0, i + 1).join('.') } to satisfy '${ keyPath }'`);
    }
  }
  return current[targetKey] as T ?? defaultValue;
}

/**
 * Load and prepare conf
 * @returns {{getConf: ((function(string=, *=): (string|number|Object))|*)}}
 */
export function useConf() {
  if (!conf || Object.keys(conf).length === 0) {
    // @ts-ignore
    loadConf(settings);
  }
  return {
    get: getConf,
  };
}
