import { call, reject, success } from './infuraCall';

let callCount = 0;

export default () => {
  const listeners = [];
  let cache = null;

  function notifyListeners (func) {
    listeners.forEach(({ req, res }) => func(req, res));
    listeners.length = 0;
  }

  return {
    call: (req, res) => {
      if (cache) {
        console.info(`Cached method: ${req.body.method} (${++callCount})`);

        success(res, cache);
      } else {
        if (!listeners.length) {
          call(req, res, (res, data) => {
            cache = data;
            notifyListeners(({ res }) => success(res, data));
          }, (res, err) => {
            notifyListeners(({ res }) => reject(res, err));
          });
        }
        listeners.push({ req, res });
      }
    },
    reset: () => {
      cache = null;
    },
    val: () => (cache)
  }
}
