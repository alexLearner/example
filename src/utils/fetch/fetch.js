import fetch from 'isomorphic-fetch';
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment';
const { HOST_APP, HOST_REACT } = process.env;

const port = 5000;
const host = canUseDOM ? HOST_APP: HOST_APP;

export default function customFetch(url, options, cookie = '') {
  if (cookie == '')
    return fetch(host + url, options);

  const obj = {...options, headers: {...options.headers, cookie: cookie}};

  return fetch(
    host + url,
    obj,
  );
}
