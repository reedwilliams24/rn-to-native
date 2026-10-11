type Todo = { title: string; done: boolean; dueDate: Date }; // @link:type

// No extensions in TS: write free helper functions
// (or patch String.prototype, which you shouldn't)
function capitalized(s: string): string { // @link:cap
  return s.charAt(0).toUpperCase() + s.slice(1); // @link:capbody
}

function isOverdue(todo: Todo): boolean { // @link:overdue
  return !todo.done && todo.dueDate < new Date(); // @link:overduebody
}

const label = capitalized('milk'); // "Milk" // @link:uselabel
const late = todos.filter(isOverdue); // @link:uselate
