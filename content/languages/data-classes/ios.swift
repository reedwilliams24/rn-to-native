struct Todo: Identifiable, Hashable {
    let id: String
    var title: String
    var done = false
}

let todo = Todo(id: "1", title: "Buy milk")
var finished = todo // assignment copies a struct
finished.done = true // todo is unchanged

// true: == is synthesized from the fields
let same = finished == finished

print(todo)
// Todo(id: "1", title: "Buy milk", done: false)
