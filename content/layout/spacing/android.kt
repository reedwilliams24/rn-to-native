@Composable
fun InfoCard(title: String, text: String, modifier: Modifier = Modifier) { // @link:fn
    Column( // @link:card
        modifier = modifier
            .padding(16.dp) // "margin": outside the background // @link:margin
            .background(MaterialTheme.colorScheme.surfaceContainer, RoundedCornerShape(12.dp)) // @link:bg
            .padding(16.dp), // padding: inside the background // @link:padding
        verticalArrangement = Arrangement.spacedBy(4.dp), // gap // @link:gap
    ) {
        Text(title, style = MaterialTheme.typography.titleMedium) // @link:title
        Text(text, color = MaterialTheme.colorScheme.onSurfaceVariant) // @link:text
        Text( // @link:link
            text = "Read more", // @link:link
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(top = 12.dp), // marginTop // @link:margintop
        )
    }
}
