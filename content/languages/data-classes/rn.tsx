type Todo = {
  id: string;
  title: string;
  done: boolean;
};

const todo: Todo = { id: '1', title: 'Buy milk', done: false };
const finished = { ...todo, done: true };

// false: objects compare by reference
finished === { ...finished };

console.log(todo);
// { id: '1', title: 'Buy milk', done: false }
