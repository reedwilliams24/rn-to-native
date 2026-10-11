enum class Priority { Low, Medium, High } // @link:enum

@Composable // @link:fn
fun PriorityBadge(priority: Priority) { // @link:fn,param
    when (priority) { // @link:switch
        Priority.High -> Text("High", color = Color.Red) // @link:high
        Priority.Medium -> Text("Medium", color = Color(0xFFFFA500)) // @link:medium
        Priority.Low -> Text("Low", color = Color.Gray) // @link:low
    }
}
