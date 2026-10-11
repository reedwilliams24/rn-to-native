@Composable // @link:fn
fun Greeting( // @link:fn,props
    name: String, // @link:name
    excited: Boolean = false, // @link:excited,default
) {
    Text("Hello, $name${if (excited) "!" else "."}") // @link:text
}

// Usage
Greeting(name = "Reed", excited = true) // @link:usage
