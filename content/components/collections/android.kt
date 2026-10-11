@Composable // @link:fn
fun TagList(tags: List<String>) { // @link:fn,param
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { // @link:row
        tags.forEach { tag -> // @link:loop
            Text("#$tag") // @link:item
        }
    }
}
