const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10_000,
});

api.interceptors.request.use(async (config) => {
  const token = await tokenStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getTodos = () => api.get<Todo[]>('/todos').then((r) => r.data);
