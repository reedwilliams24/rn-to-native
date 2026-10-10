@Composable
fun Greeting(
    name: String,
    excited: Boolean = false,
) {
    Text("Hello, $name${if (excited) "!" else "."}")
}

// Usage
Greeting(name = "Reed", excited = true)
