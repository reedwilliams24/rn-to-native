@Composable
fun RemainingCount(count: Int) {
    AnimatedContent(
        targetState = count,
        transitionSpec = {
            // Slide up when the count grows, down when it shrinks
            val direction = if (targetState > initialState) 1 else -1
            (slideInVertically { it * direction } + fadeIn())
                .togetherWith(slideOutVertically { -it * direction } + fadeOut())
        },
        label = "count",
    ) { value ->
        Text("$value left")
    }
}
