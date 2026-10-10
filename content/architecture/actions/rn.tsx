type Filter = 'all' | 'open';
type State = { todos: Todo[]; filter: Filter };

type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: string }
  | { type: 'setFilter'; filter: Filter };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return { ...state, todos: [...state.todos, { id: nanoid(), title: action.title, done: false }] };
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)),
      };
    case 'setFilter':
      return { ...state, filter: action.filter };
  }
}

const visible = (s: State) => (s.filter === 'open' ? s.todos.filter((t) => !t.done) : s.todos);
