class Ref<T>(var value: T)

@Composable
fun SubmitButton(onSubmit: () -> Unit) {
    // remember keeps the same object across recompositions.
    // It's a plain class, not State, so writes don't recompose.
    val lastTap = remember { Ref(0L) }

    Button(onClick = {
        val now = System.currentTimeMillis()
        if (now - lastTap.value >= 1000) {
            lastTap.value = now
            onSubmit()
        }
    }) {
        Text("Submit")
    }
}
