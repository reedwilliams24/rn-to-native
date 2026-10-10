@Composable
fun RecipeScreen() {
    val view = LocalView.current

    // For setup/teardown that isn't a coroutine: listeners, callbacks, flags
    DisposableEffect(view) {
        view.keepScreenOn = true
        onDispose { view.keepScreenOn = false } // required, like a cleanup fn
    }

    RecipeSteps()
}
