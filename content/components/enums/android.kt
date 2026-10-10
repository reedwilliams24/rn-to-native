enum class Priority { Low, Medium, High }

@Composable
fun PriorityBadge(priority: Priority) {
    when (priority) {
        Priority.High -> Text("High", color = Color.Red)
        Priority.Medium -> Text("Medium", color = Color(0xFFFFA500))
        Priority.Low -> Text("Low", color = Color.Gray)
    }
}
