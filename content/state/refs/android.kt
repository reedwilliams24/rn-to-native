class Ref<T>(var value: T) // @link:refclass

@Composable
fun SubmitButton(onSubmit: () -> Unit) { // @link:fn
    // remember keeps the same object across recompositions.
    // It's a plain class, not State, so writes don't recompose.
    val lastTap = remember { Ref(0L) } // @link:ref

    Button(onClick = { // @link:button,press
        val now = System.currentTimeMillis() // @link:now
        if (now - lastTap.value >= 1000) { // @link:check
            lastTap.value = now // @link:write
            onSubmit() // @link:call
        }
    }) {
        Text("Submit") // @link:label
    }
}
