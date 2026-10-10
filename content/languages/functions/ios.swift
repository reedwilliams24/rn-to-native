// One expression: implicit return
func greet(_ name: String, greeting: String = "Hello") -> String {
    "\(greeting), \(name)!"
}

func shout(_ s: String) -> String { s.uppercased() }

// Argument label `to`, parameter name `recipient`
func send(
    _ message: String,
    to recipient: String,
    silent: Bool = false
) {
    let flag = silent ? " (silent)" : ""
    print("\(message) → \(recipient)\(flag)")
}

greet("Reed")
greet("Reed", greeting: "Hi")
send("Lunch?", to: "Sam", silent: true)
