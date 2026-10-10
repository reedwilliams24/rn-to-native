// Every object is a reference
const a = { count: 0 };
const b = a;
b.count += 1;
console.log(a.count); // 1: same object

const t1 = { title: 'Buy milk', done: false };
const t2 = { ...t1, done: true }; // copy by convention
console.log(t1.done); // false
