struct Greeting: View { // @link:fn,props
    let name: String // @link:name
    var excited = false // @link:excited,default

    var body: some View { // @link:body
        Text("Hello, \(name)\(excited ? "!" : ".")") // @link:text
    }
}

// Usage
Greeting(name: "Reed", excited: true) // @link:usage
