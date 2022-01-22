export const guardedFetch = (info: RequestInfo) => {
  return fetch(info).then((response) => {
    if (!response.ok) {
      throw new Error(`request failed for ${info}`);
    }
    return response;
  });
};
