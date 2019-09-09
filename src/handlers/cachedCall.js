import { call, reject, success } from './infuraCall';

let callCount = 0;

export default () => {
  const listeners = [];
  let cache = null;

  function notifyListeners (func) {
    listeners.forEach(func);
    listeners.length = 0;
  }

  return {
    call: (req, res) => {
      if (cache) {
        console.info(`Cached method: ${req.body.method} (${++callCount})`);
        res.setHeader('X-CACHE-COUNTER', callCount);
        success(res, {
          ...cache,
          id: req.body.id
        });
      } else {
        if (!listeners.length) {
          call(req, res, (res, data) => {
            cache = data;
            notifyListeners(({ req, res }) => success(res, {
              ...data,
              id: req.body.id
            }));
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
