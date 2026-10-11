@Composable
fun LikeButton(
    liked: Boolean,
    onToggle: /*[*/() -> Unit/*]*/,
) {
    Button(onClick = onToggle) {
        Text(if (liked) "Liked" else "Like")
    }
}

@Composable
fun Post() {
    var liked /*[*/by/*]*/ /*[*/remember/*]*/ {
        mutableStateOf(false)
    }
    LikeButton(
        liked = liked,
        onToggle = { /*[*/liked = !liked/*]*/ },
    )
}
