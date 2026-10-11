@Composable // @link:fn
fun Counter() { // @link:fn
    var count by remember { mutableIntStateOf(0) } // @link:state
    Row( // @link:row
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp), // @link:row
    ) {
        Button(onClick = { count-- }) { Text("−") } // @link:dec
        Text("$count") // @link:text
        Button(onClick = { count++ }) { Text("+") } // @link:inc
    }
}
