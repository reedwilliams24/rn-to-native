type Todo = { id: string; title: string; done: boolean }; // @link:model

type TodoStore = { // @link:store
  todos: Todo[]; // @link:todos
  add: (title: string) => void; // @link:add-sig
  toggle: (id: string) => void; // @link:toggle-sig
};

// Zustand: a module-level store that any component can subscribe to
const useTodoStore = create<TodoStore>((set) => ({ // @link:store
  todos: [], // @link:todos
  add: (title) => // @link:add
    set((s) => ({
      todos: [...s.todos, { id: nanoid(), title, done: false }], // @link:add
    })),
  toggle: (id) => // @link:toggle
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)), // @link:toggle
    })),
}));
