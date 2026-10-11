// One expression: implicit return
func greet(_ name: String, greeting: String = "Hello") -> String { // @link:greet
    "\(greeting), \(name)!" // @link:body
}

func shout(_ s: String) -> String { s.uppercased() } // @link:shout

// Argument label `to`, parameter name `recipient`
func send( // @link:send
    _ message: String, // @link:msg
    to recipient: String, // @link:to
    silent: Bool = false // @link:silent
) {
    let flag = silent ? " (silent)" : "" // @link:flag
    print("\(message) → \(recipient)\(flag)") // @link:print
}

greet("Reed") // @link:call1
greet("Reed", greeting: "Hi") // @link:call2
send("Lunch?", to: "Sam", silent: true) // @link:call3
