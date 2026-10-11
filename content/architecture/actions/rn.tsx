type Filter = 'all' | 'open'; // @link:filter
type State = { todos: Todo[]; filter: Filter }; // @link:state

type Action = // @link:action
  | { type: 'add'; title: string } // @link:add
  | { type: 'toggle'; id: string } // @link:toggle
  | { type: 'setFilter'; filter: Filter }; // @link:setfilter

function reducer(state: State, action: Action): State { // @link:reduce
  switch (action.type) { // @link:switch
    case 'add': // @link:add-case
      return { ...state, todos: [...state.todos, { id: nanoid(), title: action.title, done: false }] }; // @link:add-case
    case 'toggle': // @link:toggle-case
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)), // @link:toggle-case
      };
    case 'setFilter': // @link:filter-case
      return { ...state, filter: action.filter }; // @link:filter-case
  }
}

const visible = (s: State) => (s.filter === 'open' ? s.todos.filter((t) => !t.done) : s.todos); // @link:visible
