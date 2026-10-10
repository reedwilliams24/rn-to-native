@OptIn(ExperimentalSharedTransitionApi::class)
@Composable
fun PhotoToggle() {
    var expanded by remember { mutableStateOf(false) }

    SharedTransitionLayout {
        AnimatedContent(targetState = expanded, label = "photo") { isExpanded ->
            val shared = Modifier.sharedElement(
                rememberSharedContentState(key = "photo"),
                animatedVisibilityScope = this@AnimatedContent,
            )
            if (isExpanded) {
                Box(
                    shared
                        .fillMaxWidth()
                        .aspectRatio(1f)
                        .background(Color(0xFF1A56DB))
                        .clickable { expanded = false },
                )
            } else {
                Box(
                    shared
                        .size(64.dp)
                        .background(Color(0xFF1A56DB), RoundedCornerShape(12.dp))
                        .clickable { expanded = true },
                )
            }
        }
    }
}
