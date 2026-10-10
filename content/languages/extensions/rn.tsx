type Todo = { title: string; done: boolean; dueDate: Date };

// No extensions in TS: write free helper functions
// (or patch String.prototype, which you shouldn't)
function capitalized(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isOverdue(todo: Todo): boolean {
  return !todo.done && todo.dueDate < new Date();
}

const label = capitalized('milk'); // "Milk"
const late = todos.filter(isOverdue);
