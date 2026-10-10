type Todo = { id: string; title: string; done: boolean };

type TodoStore = {
  todos: Todo[];
  add: (title: string) => void;
  toggle: (id: string) => void;
};

// Zustand: a module-level store that any component can subscribe to
const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  add: (title) =>
    set((s) => ({
      todos: [...s.todos, { id: nanoid(), title, done: false }],
    })),
  toggle: (id) =>
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    })),
}));
