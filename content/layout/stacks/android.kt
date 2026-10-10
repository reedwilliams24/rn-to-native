@Composable
fun ProfileHeader(name: String, handle: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically, // alignItems
        horizontalArrangement = Arrangement.spacedBy(12.dp), // gap
    ) {
        Box(Modifier.size(48.dp).background(Color.Gray, CircleShape))
        Column {
            Text(name, fontWeight = FontWeight.SemiBold)
            Text("@$handle", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
