@Composable
fun Stat(value: String, label: String) {
    // Size the icon in sp so it scales with the user's font size, like the text
    val iconSize = with(LocalDensity.current) { 20.sp.toDp() }
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Icon(Icons.Filled.Star, contentDescription = null, modifier = Modifier.size(iconSize))
        Text(value, style = MaterialTheme.typography.bodyLarge)
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}
