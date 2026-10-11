@Composable
fun StatRow(label: String, value: String) { // @link:fn
    val density = LocalDensity.current // @link:scale
    val stacked = density.fontScale >= 1.5f // @link:stacked
    val iconSize = with(density) { 20.sp.toDp() } // grows with the font scale // @link:icon-size

    @Composable
    fun CheckIcon() = Icon(Icons.Filled.Check, contentDescription = null, Modifier.size(iconSize)) // @link:icon

    if (stacked) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) { // @link:layout
            CheckIcon()
            Text(label)
            Text(value, fontWeight = FontWeight.SemiBold)
        }
    } else {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { // @link:layout
            CheckIcon()
            Text(label, Modifier.weight(1f)) // @link:label
            Text(value, fontWeight = FontWeight.SemiBold)
        }
    }
}
