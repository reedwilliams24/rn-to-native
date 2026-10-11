struct Todo: Identifiable, Hashable { // @link:type
    let id: String // @link:id
    var title: String // @link:title
    var done = false // @link:done
}

let todo = Todo(id: "1", title: "Buy milk") // @link:create
var finished = todo // assignment copies a struct // @link:copy
finished.done = true // todo is unchanged // @link:copy

// true: == is synthesized from the fields
let same = finished == finished // @link:equals

print(todo) // @link:print
// Todo(id: "1", title: "Buy milk", done: false) // @link:out
