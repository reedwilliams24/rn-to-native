data class Spacing(val sm: Dp = 8.dp, val md: Dp = 16.dp)

val LocalSpacing = staticCompositionLocalOf { Spacing() }

@Composable
fun AppTheme(content: @Composable () -> Unit) {
    val colors = if (isSystemInDarkTheme()) {
        darkColorScheme(primary = Color(0xFFADC6FF))
    } else {
        lightColorScheme(primary = Color(0xFF1A56DB))
    }
    CompositionLocalProvider(LocalSpacing provides Spacing()) {
        MaterialTheme(colorScheme = colors, content = content)
    }
}

@Composable
fun Tag(label: String) {
    val spacing = LocalSpacing.current
    Text(
        text = label,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.onPrimaryContainer,
        modifier = Modifier
            .background(MaterialTheme.colorScheme.primaryContainer, MaterialTheme.shapes.small)
            .padding(horizontal = spacing.md, vertical = spacing.sm),
    )
}
