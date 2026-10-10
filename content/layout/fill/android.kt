@Composable
fun TitleRow(title: String, onEdit: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = title,
            modifier = Modifier.weight(1f), // flex: 1
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        TextButton(onClick = onEdit) { Text("Edit") }
    }
}
