import { useCommonStore } from "@/store/common";

const _guardResponse = async (response) => {
  if (!response.ok) {
    const commonStore = useCommonStore();
    commonStore.addTransientError(await response.text());
    return null;
  }
  return response;
};

const _initJson = (init?) => ({
  ...init,
  headers: {
    ...init?.headers,
    ...(init?.body && { "Content-Type": "application/json" }),
    Accept: "application/json",
  },
});

const _initText = (init?) => ({
  ...init,
  headers: {
    ...init?.headers,
    ...(init?.body && { "Content-Type": "application/json" }),
  },
});

export const fetchResponse = async (url, init?: RequestInit) => fetch(url, init);

export const fetchJson = async (url, init?: RequestInit) => {
  const response = await fetchResponse(url, _initJson(init));
  return response ? response.json() : response;
};

export const fetchText = async (url, init?: RequestInit) => {
  const response = await fetchResponse(url, _initText(init));
  return response ? response.text() : response;
};

export const guardedFetchResponse = async (url, init?: RequestInit) => _guardResponse(await fetchResponse(url, init));

export const guardedFetchJson = async (url, init?: RequestInit) => {
  const response = await _guardResponse(await fetchResponse(url, _initJson(init)));
  return response ? response.json() : response;
};

export const guardedFetchText = async (url, init?: RequestInit) => {
  const response = await _guardResponse(await fetchResponse(url, _initText(init)));
  return response ? response.text() : response;
};
