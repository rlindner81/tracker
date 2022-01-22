import store from "./store";

export const guardedFetchResponse = async (info: RequestInfo) => {
  const response = await fetch(info);
  if (!response.ok) {
    store.commit("error/responseNotOk", response);
    return null;
  }
  return response;
};

export const guardedFetchJson = async (info: RequestInfo) => {
  const response = await guardedFetchResponse(info);
  return response ? response.json() : response;
};

export const guardedFetchText = async (info: RequestInfo) => {
  const response = await guardedFetchResponse(info);
  return response ? response.text() : response;
};
