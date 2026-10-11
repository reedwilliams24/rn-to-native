@Composable
fun ProfileHeader(name: String, handle: String) { // @link:fn
    Row( // @link:row
        verticalAlignment = Alignment.CenterVertically, // alignItems // @link:row
        horizontalArrangement = Arrangement.spacedBy(12.dp), // gap // @link:row
    ) {
        Box(Modifier.size(48.dp).background(Color.Gray, CircleShape)) // @link:avatar
        Column { // @link:col
            Text(name, fontWeight = FontWeight.SemiBold) // @link:name
            Text("@$handle", color = MaterialTheme.colorScheme.onSurfaceVariant) // @link:handle
        }
    }
}
