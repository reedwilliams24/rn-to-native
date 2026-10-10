@Composable
fun TagList(tags: List<String>) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        tags.forEach { tag ->
            Text("#$tag")
        }
    }
}
