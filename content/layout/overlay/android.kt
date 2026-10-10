@Composable
fun AvatarWithBadge(count: Int) {
    Box(Modifier.size(48.dp).background(Color.Gray, CircleShape)) {
        if (count > 0) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .align(Alignment.TopEnd) // top: 0, right: 0
                    .offset(x = 4.dp, y = (-4).dp) // nudge past the corner
                    .sizeIn(minWidth = 20.dp, minHeight = 20.dp)
                    .background(Color.Red, CircleShape),
            ) {
                Text("$count", color = Color.White, fontSize = 12.sp)
            }
        }
    }
}
