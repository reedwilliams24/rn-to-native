let refreshing: Promise<string> | null = null;

api.interceptors.response.use(undefined, async (error) => {
  const original = error.config;
  if (error.response?.status !== 401 || original._retried) throw error;
  original._retried = true;

  // Share one refresh between every request that got a 401
  refreshing ??= refreshAccessToken().finally(() => {
    refreshing = null;
  });
  const token = await refreshing;

  original.headers.Authorization = `Bearer ${token}`;
  return api(original);
});
