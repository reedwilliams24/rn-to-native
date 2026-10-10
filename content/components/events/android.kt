@Composable
fun TodoRow(
    title: String,
    done: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onToggle)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Checkbox(checked = done, onCheckedChange = { onToggle() })
        Text(title, modifier = Modifier.padding(start = 8.dp))
    }
}
