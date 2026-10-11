const name = 'Reed'; // can't be reassigned // @link:const
let count = 0; // can be reassigned // @link:var
count += 1; // @link:inc

const todos: string[] = []; // @link:list
// const doesn't freeze the array
todos.push('Buy milk'); // @link:add

// Annotation optional: the type is inferred
const total: number = 42; // @link:total
const ratio = total / 5; // 8.4: always a double // @link:ratio,exact
