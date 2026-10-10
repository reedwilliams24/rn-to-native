type LoadState =
  | { status: 'loading' }
  | { status: 'success'; todos: Todo[] }
  | { status: 'error'; message: string };

function label(state: LoadState): string {
  switch (state.status) {
    case 'loading':
      return 'Loading…';
    case 'success':
      return `${state.todos.length} todos`;
    case 'error':
      return `Error: ${state.message}`;
  }
}
