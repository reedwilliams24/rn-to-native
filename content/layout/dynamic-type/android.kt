@Composable
fun Stat(value: String, label: String) { // @link:fn
    // Size the icon in sp so it scales with the user's font size, like the text
    val iconSize = with(LocalDensity.current) { 20.sp.toDp() } // @link:scale
    Row( // @link:row
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp), // @link:row
    ) {
        Icon(Icons.Filled.Star, contentDescription = null, modifier = Modifier.size(iconSize)) // @link:icon
        Text(value, style = MaterialTheme.typography.bodyLarge) // @link:value
        Text( // @link:label
            text = label, // @link:label
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
