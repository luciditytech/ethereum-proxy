import cachedCall from './cachedCall';

const { call }  = cachedCall();

export default function(req, res) {
  call(req, res);
}
