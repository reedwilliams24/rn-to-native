@Composable
fun Elapsed() {
    var seconds by remember { mutableIntStateOf(0) }

    // Unit never changes, so this runs once, like useEffect(fn, [])
    LaunchedEffect(Unit) {
        while (true) {
            delay(1_000) // suspends; doesn't block the main thread
            seconds++
        }
    } // no cleanup needed: the coroutine is cancelled when Elapsed leaves

    Text("${seconds}s")
}
