// A class: reference type
final class Counter { var count = 0 }

// A struct: value type
struct Todo {
    var title: String
    var done = false
}

let a = Counter()
let b = a
b.count += 1
print(a.count) // 1: same object, like JS

let t1 = Todo(title: "Buy milk")
var t2 = t1 // copies the whole value
t2.done = true
print(t1.done) // false: t1 is untouched
