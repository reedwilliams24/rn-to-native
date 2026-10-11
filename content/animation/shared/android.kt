@OptIn(ExperimentalSharedTransitionApi::class)
@Composable
fun PhotoToggle() {
    var expanded by remember { mutableStateOf(false) }

    SharedTransitionLayout { // @link:layout
        AnimatedContent(targetState = expanded, label = "photo") { isExpanded -> // @link:layout
            val shared = Modifier.sharedElement( // @link:tag
                rememberSharedContentState(key = "photo"), // @link:tag
                animatedVisibilityScope = this@AnimatedContent,
            )
            if (isExpanded) {
                Box(
                    shared
                        .fillMaxWidth() // @link:large
                        .aspectRatio(1f) // @link:large
                        .background(Color(0xFF1A56DB))
                        .clickable { expanded = false }, // @link:toggle
                )
            } else {
                Box(
                    shared
                        .size(64.dp) // @link:small
                        .background(Color(0xFF1A56DB), RoundedCornerShape(12.dp)) // @link:small
                        .clickable { expanded = true }, // @link:toggle
                )
            }
        }
    }
}
