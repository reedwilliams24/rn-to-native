struct Greeting: View {
    let name: String
    var excited = false

    var body: some View {
        Text("Hello, \(name)\(excited ? "!" : ".")")
    }
}

// Usage
Greeting(name: "Reed", excited: true)
