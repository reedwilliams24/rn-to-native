@Composable
fun InfoCard(title: String, text: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .padding(16.dp) // "margin": outside the background
            .background(MaterialTheme.colorScheme.surfaceContainer, RoundedCornerShape(12.dp))
            .padding(16.dp), // padding: inside the background
        verticalArrangement = Arrangement.spacedBy(4.dp), // gap
    ) {
        Text(title, style = MaterialTheme.typography.titleMedium)
        Text(text, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(
            text = "Read more",
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(top = 12.dp), // marginTop
        )
    }
}
