interface TodoRepository {
  list(): Promise<Todo[]>;
}

// RN apps usually "inject" with module imports or context
const RepoContext = createContext<TodoRepository>(httpTodoRepository);

function useTodos() {
  const repo = useContext(RepoContext);
  return useQuery({ queryKey: ['todos'], queryFn: () => repo.list() });
}

// Tests and stories swap the implementation:
// <RepoContext.Provider value={fakeRepo}>…</RepoContext.Provider>
