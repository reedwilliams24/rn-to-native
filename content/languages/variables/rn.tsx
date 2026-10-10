const name = 'Reed'; // can't be reassigned
let count = 0; // can be reassigned
count += 1;

const todos: string[] = [];
// const doesn't freeze the array
todos.push('Buy milk');

// Annotation optional: the type is inferred
const total: number = 42;
const ratio = total / 5; // 8.4: always a double
