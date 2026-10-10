// Android has no "Reduce motion" flag. The closest is
// Settings → Accessibility → Remove animations, which zeroes this scale.
@Composable
fun rememberReduceMotion(): Boolean {
    val resolver = LocalContext.current.contentResolver
    return remember {
        Settings.Global.getFloat(resolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
}

@Composable
fun Banner(visible: Boolean, content: @Composable () -> Unit) {
    val reduceMotion = rememberReduceMotion()

    AnimatedVisibility(
        visible = visible,
        enter = if (reduceMotion) fadeIn() else slideInVertically() + fadeIn(),
        exit = if (reduceMotion) fadeOut() else slideOutVertically() + fadeOut(),
    ) {
        content()
    }
}
