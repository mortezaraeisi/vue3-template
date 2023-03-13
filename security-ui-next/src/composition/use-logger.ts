export function useLogger() {

  function catchError(e: Error | unknown, explanation?: string) {
    console.error('Catch and error', e, explanation);
  }

  function log(...args: Array<any>) {
    console.log(...args);
  }

  function debug(...args: Array<any>) {
    if (import.meta.env.MODE === 'development') {
      log('dbg!', ...args);
    }
  }

  return {
    log,
    debug,
    catchError,
  };
}
