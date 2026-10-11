data class Spacing(val sm: Dp = 8.dp, val md: Dp = 16.dp) // @link:spacing

val LocalSpacing = staticCompositionLocalOf { Spacing() } // @link:provide

@Composable
fun AppTheme(content: @Composable () -> Unit) { // @link:theme
    val colors = if (isSystemInDarkTheme()) { // @link:colors
        darkColorScheme(primary = Color(0xFFADC6FF)) // @link:colors
    } else {
        lightColorScheme(primary = Color(0xFF1A56DB)) // @link:colors
    }
    CompositionLocalProvider(LocalSpacing provides Spacing()) { // @link:provide
        MaterialTheme(colorScheme = colors, content = content)
    }
}

@Composable
fun Tag(label: String) { // @link:tag
    val spacing = LocalSpacing.current // @link:read
    Text( // @link:text
        text = label, // @link:label
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.onPrimaryContainer, // @link:fg
        modifier = Modifier
            .background(MaterialTheme.colorScheme.primaryContainer, MaterialTheme.shapes.small) // @link:bg
            .padding(horizontal = spacing.md, vertical = spacing.sm), // @link:padh,padv
    )
}
