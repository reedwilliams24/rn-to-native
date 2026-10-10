@Composable
fun StatRow(label: String, value: String) {
    val density = LocalDensity.current
    val stacked = density.fontScale >= 1.5f
    val iconSize = with(density) { 20.sp.toDp() } // grows with the font scale

    @Composable
    fun CheckIcon() = Icon(Icons.Filled.Check, contentDescription = null, Modifier.size(iconSize))

    if (stacked) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            CheckIcon()
            Text(label)
            Text(value, fontWeight = FontWeight.SemiBold)
        }
    } else {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            CheckIcon()
            Text(label, Modifier.weight(1f))
            Text(value, fontWeight = FontWeight.SemiBold)
        }
    }
}
