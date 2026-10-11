@Composable
fun TitleRow(title: String, onEdit: () -> Unit) { // @link:fn
    Row( // @link:row
        modifier = Modifier.fillMaxWidth(), // @link:row
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text( // @link:text
            text = title, // @link:text
            modifier = Modifier.weight(1f), // flex: 1 // @link:flex
            maxLines = 1, // @link:lines
            overflow = TextOverflow.Ellipsis, // @link:lines
        )
        TextButton(onClick = onEdit) { Text("Edit") } // @link:edit
    }
}
