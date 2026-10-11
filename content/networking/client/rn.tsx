const api = axios.create({ // @link:client
  baseURL: 'https://api.example.com', // @link:base
  timeout: 10_000, // @link:timeout
});

api.interceptors.request.use(async (config) => { // @link:intercept
  const token = await tokenStore.getAccessToken(); // @link:token
  if (token) config.headers.Authorization = `Bearer ${token}`; // @link:header
  return config; // @link:proceed
});

const getTodos = () => api.get<Todo[]>('/todos').then((r) => r.data); // @link:usage
