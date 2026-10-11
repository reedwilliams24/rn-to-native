@Composable
fun Elapsed() { // @link:fn
    var seconds by remember { mutableIntStateOf(0) } // @link:state

    // Unit never changes, so this runs once, like useEffect(fn, [])
    LaunchedEffect(Unit) { // @link:effect
        while (true) { // @link:loop
            delay(1_000) // suspends; doesn't block the main thread // @link:tick
            seconds++ // @link:tick
        }
    } // no cleanup needed: the coroutine is cancelled when Elapsed leaves // @link:cleanup

    Text("${seconds}s") // @link:text
}
