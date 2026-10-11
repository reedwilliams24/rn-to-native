@Composable
fun AvatarWithBadge(count: Int) { // @link:fn
    Box(Modifier.size(48.dp).background(Color.Gray, CircleShape)) { // @link:avatar
        if (count > 0) { // @link:cond
            Box( // @link:badge
                contentAlignment = Alignment.Center, // @link:badge
                modifier = Modifier
                    .align(Alignment.TopEnd) // top: 0, right: 0 // @link:pos
                    .offset(x = 4.dp, y = (-4).dp) // nudge past the corner // @link:pos
                    .sizeIn(minWidth = 20.dp, minHeight = 20.dp) // @link:size
                    .background(Color.Red, CircleShape), // @link:bg
            ) {
                Text("$count", color = Color.White, fontSize = 12.sp) // @link:text
            }
        }
    }
}
