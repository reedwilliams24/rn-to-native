// Android has no "Reduce motion" flag. The closest is
// Settings → Accessibility → Remove animations, which zeroes this scale.
@Composable
fun rememberReduceMotion(): Boolean { // @link:reduce
    val resolver = LocalContext.current.contentResolver
    return remember {
        Settings.Global.getFloat(resolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
}

@Composable
fun Banner(visible: Boolean, content: @Composable () -> Unit) { // @link:fn
    val reduceMotion = rememberReduceMotion() // @link:reduce

    AnimatedVisibility( // @link:visible
        visible = visible,
        enter = if (reduceMotion) fadeIn() else slideInVertically() + fadeIn(), // @link:enter
        exit = if (reduceMotion) fadeOut() else slideOutVertically() + fadeOut(), // @link:exit
    ) {
        content() // @link:content
    }
}
