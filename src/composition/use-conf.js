let conf = null;

/**
 * Update the current config state
 * @param confObj{object}
 */
export function loadConf(confObj) {
  conf = Object.freeze({
    ...conf,
    ...confObj,
  });
}

/**
 * Return the config value at the specified key-path
 * @param keyPath{string}
 * @param defaultValue{string|number|object=}
 * @return {string|number|object}
 */
export function getConf(keyPath = '', defaultValue) {
  if (!keyPath || typeof keyPath !== 'string') {
    throw new Error('keyPath must be a valid string.');
  }

  const keys = keyPath.split('.');
  const targetKey = keys.pop();
  let current = conf;
  for (let i = 0; i < keys.length; i += 1) {
    current = current[keys[i]];
    if (!current) {
      if (arguments.length >= 2) {
        return defaultValue;
      }
      throw new Error(`Specified path not found. conf::${keys.slice(0, i + 1).join('.')} to satisfy '${keyPath}'`);
    }
  }
  return current[targetKey] ?? defaultValue;
}

/**
 * Load and prepare conf
 * @returns {{getConf: ((function(string=, *=): (string|number|Object))|*)}}
 */
export function useConf() {
  if (!conf) {
    loadConf(settings);
  }
  return {
    getConf,
  };
}
