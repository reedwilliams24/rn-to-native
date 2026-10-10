let isDone: (Todo) -> Bool = { todo in todo.done }

func measure(_ label: String, _ block: () -> Void) {
    let start = Date.now
    block()
    let s = Date.now.timeIntervalSince(start)
    print("\(label): \(s)s")
}

func example(todos: [Todo]) {
    measure("filter") { // trailing closure
        // $0 is the first parameter
        let open = todos.filter { !$0.done }
        print(open.map(\.title)) // key path
    }

    var taps = 0
    let onTap = { taps += 1 } // captures taps
    onTap()
}
