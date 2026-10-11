@Composable // @link:fn
fun TodoRow( // @link:fn,props
    title: String, // @link:title
    done: Boolean, // @link:done
    onToggle: () -> Unit, // @link:callback
    modifier: Modifier = Modifier,
) {
    Row( // @link:row
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onToggle) // @link:pressable,tap
            .padding(16.dp), // @link:row
        verticalAlignment = Alignment.CenterVertically, // @link:row
    ) {
        Checkbox(checked = done, onCheckedChange = { onToggle() }) // @link:check
        Text(title, modifier = Modifier.padding(start = 8.dp)) // @link:label
    }
}
