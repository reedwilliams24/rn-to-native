type LoadState = // @link:type
  | { status: 'loading' } // @link:loading
  | { status: 'success'; todos: Todo[] } // @link:success
  | { status: 'error'; message: string }; // @link:error

function label(state: LoadState): string { // @link:fn
  switch (state.status) { // @link:switch
    case 'loading': // @link:loading-case
      return 'Loading…'; // @link:loading-case
    case 'success': // @link:success-case
      return `${state.todos.length} todos`; // @link:success-case
    case 'error': // @link:error-case
      return `Error: ${state.message}`; // @link:error-case
  }
}
