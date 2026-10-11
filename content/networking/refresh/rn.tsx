let refreshing: Promise<string> | null = null; // @link:inflight

api.interceptors.response.use(undefined, async (error) => { // @link:hook
  const original = error.config;
  if (error.response?.status !== 401 || original._retried) throw error; // @link:guard
  original._retried = true; // @link:guard

  // Share one refresh between every request that got a 401
  refreshing ??= refreshAccessToken().finally(() => { // @link:refresh,inflight
    refreshing = null; // @link:clear
  });
  const token = await refreshing; // @link:join

  original.headers.Authorization = `Bearer ${token}`; // @link:retry
  return api(original); // @link:retry
});
