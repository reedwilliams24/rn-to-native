interface TodoRepository { // @link:iface
  list(): Promise<Todo[]>; // @link:list
}

// RN apps usually "inject" with module imports or context // @link:inject
const RepoContext = createContext<TodoRepository>(httpTodoRepository); // @link:bind

function useTodos() { // @link:consumer
  const repo = useContext(RepoContext); // @link:consumer,resolve
  return useQuery({ queryKey: ['todos'], queryFn: () => repo.list() });
}

// Tests and stories swap the implementation:
// <RepoContext.Provider value={fakeRepo}>…</RepoContext.Provider> // @link:fake
