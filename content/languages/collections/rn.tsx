const todos: Todo[] = [
  { id: '1', title: 'Buy milk', done: true },
  { id: '2', title: 'Book flights', done: false },
];

const open = todos.filter((t) => !t.done).map((t) => t.title);
const doneCount = todos.filter((t) => t.done).length;
const score = todos.reduce((n, t) => n + (t.done ? 1 : 0), 0);
const byId = Object.fromEntries(todos.map((t) => [t.id, t]));

// Todo | undefined
const firstB = todos.find((t) => t.title.startsWith('B'));

// sort() mutates, so copy first
const sorted = [...todos].sort((a, b) =>
  a.title.localeCompare(b.title),
);
