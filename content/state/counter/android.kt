@Composable
fun Counter() {
    var count by remember { mutableIntStateOf(0) }
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Button(onClick = { count-- }) { Text("−") }
        Text("$count")
        Button(onClick = { count++ }) { Text("+") }
    }
}
