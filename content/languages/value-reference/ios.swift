// A class: reference type // @link:ref
final class Counter { var count = 0 } // @link:counter

// A struct: value type
struct Todo { // @link:todo-type
    var title: String
    var done = false
}

let a = Counter() // @link:a
let b = a // @link:b
b.count += 1 // @link:mut
print(a.count) // 1: same object, like JS // @link:print

let t1 = Todo(title: "Buy milk") // @link:t1
var t2 = t1 // copies the whole value // @link:t2
t2.done = true // @link:t2
print(t1.done) // false: t1 is untouched // @link:print2
