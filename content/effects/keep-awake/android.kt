@Composable
fun RecipeScreen() { // @link:fn
    val view = LocalView.current

    // For setup/teardown that isn't a coroutine: listeners, callbacks, flags
    DisposableEffect(view) { // @link:effect
        view.keepScreenOn = true // @link:on
        onDispose { view.keepScreenOn = false } // required, like a cleanup fn // @link:cleanup,off
    }

    RecipeSteps() // @link:content
}
