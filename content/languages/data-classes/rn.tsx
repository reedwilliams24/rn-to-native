type Todo = { // @link:type
  id: string; // @link:id
  title: string; // @link:title
  done: boolean; // @link:done
};

const todo: Todo = { id: '1', title: 'Buy milk', done: false }; // @link:create
const finished = { ...todo, done: true }; // @link:copy

// false: objects compare by reference
finished === { ...finished }; // @link:identity

console.log(todo); // @link:print
// { id: '1', title: 'Buy milk', done: false } // @link:out
