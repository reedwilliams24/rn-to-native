const todos: Todo[] = [ // @link:list
  { id: '1', title: 'Buy milk', done: true }, // @link:item1
  { id: '2', title: 'Book flights', done: false }, // @link:item2
];

const open = todos.filter((t) => !t.done).map((t) => t.title); // @link:open
const doneCount = todos.filter((t) => t.done).length; // @link:count
const score = todos.reduce((n, t) => n + (t.done ? 1 : 0), 0); // @link:fold
const byId = Object.fromEntries(todos.map((t) => [t.id, t])); // @link:byid

// Todo | undefined // @link:findtype
const firstB = todos.find((t) => t.title.startsWith('B')); // @link:find

// sort() mutates, so copy first
const sorted = [...todos].sort((a, b) => // @link:sort
  a.title.localeCompare(b.title), // @link:sort
);
