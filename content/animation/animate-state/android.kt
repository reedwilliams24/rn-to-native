@Composable
fun LikeButton(liked: Boolean, onToggle: () -> Unit) { // @link:fn
    val scale by animateFloatAsState( // @link:scale
        targetValue = if (liked) 1.3f else 1f, // @link:scale
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy), // @link:spring
        label = "scale",
    )
    val tint by animateColorAsState( // @link:tint
        targetValue = if (liked) Color.Red else Color.Gray,
        label = "tint",
    )

    IconButton(onClick = onToggle) { // @link:button
        Icon(
            Icons.Filled.Favorite, // @link:icon
            contentDescription = if (liked) "Unlike" else "Like",
            tint = tint,
            modifier = Modifier.graphicsLayer { // @link:apply
                scaleX = scale // @link:apply
                scaleY = scale
            },
        )
    }
}
