@Composable
fun LikeButton(liked: Boolean, onToggle: () -> Unit) {
    val scale by animateFloatAsState(
        targetValue = if (liked) 1.3f else 1f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy),
        label = "scale",
    )
    val tint by animateColorAsState(
        targetValue = if (liked) Color.Red else Color.Gray,
        label = "tint",
    )

    IconButton(onClick = onToggle) {
        Icon(
            Icons.Filled.Favorite,
            contentDescription = if (liked) "Unlike" else "Like",
            tint = tint,
            modifier = Modifier.graphicsLayer {
                scaleX = scale
                scaleY = scale
            },
        )
    }
}
