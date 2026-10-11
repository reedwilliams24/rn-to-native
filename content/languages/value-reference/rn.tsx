// Every object is a reference // @link:ref
const a = { count: 0 }; // @link:a
const b = a; // @link:b
b.count += 1; // @link:mut
console.log(a.count); // 1: same object // @link:print

const t1 = { title: 'Buy milk', done: false }; // @link:t1
const t2 = { ...t1, done: true }; // copy by convention // @link:t2
console.log(t1.done); // false // @link:print2
