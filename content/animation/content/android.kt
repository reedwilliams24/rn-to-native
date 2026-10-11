@Composable
fun RemainingCount(count: Int) { // @link:fn
    AnimatedContent( // @link:transition
        targetState = count,
        transitionSpec = { // @link:transition
            // Slide up when the count grows, down when it shrinks
            val direction = if (targetState > initialState) 1 else -1
            (slideInVertically { it * direction } + fadeIn())
                .togetherWith(slideOutVertically { -it * direction } + fadeOut())
        },
        label = "count",
    ) { value ->
        Text("$value left") // @link:text
    }
}
