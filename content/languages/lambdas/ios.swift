let isDone: (Todo) -> Bool = { todo in todo.done } // @link:isdone

func measure(_ label: String, _ block: () -> Void) { // @link:measure
    let start = Date.now // @link:start
    block() // @link:call
    let s = Date.now.timeIntervalSince(start) // @link:print
    print("\(label): \(s)s") // @link:print
}

func example(todos: [Todo]) { // @link:example
    measure("filter") { // trailing closure // @link:trailing
        // $0 is the first parameter
        let open = todos.filter { !$0.done } // @link:filter
        print(open.map(\.title)) // key path // @link:map
    }

    var taps = 0 // @link:taps
    let onTap = { taps += 1 } // captures taps // @link:ontap
    onTap() // @link:invoke
}
