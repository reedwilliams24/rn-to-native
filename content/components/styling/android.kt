@Composable
fun Chip(
    label: String,
    modifier: Modifier = Modifier,
) {
    Text(
        text = label,
        fontSize = 14.sp,
        fontWeight = FontWeight.SemiBold,
        color = Color(0xFF1A56DB),
        modifier = modifier
            // outer → inner: background first, then padding inside it
            .background(Color(0xFFE8F0FE), RoundedCornerShape(16.dp))
            .padding(horizontal = 12.dp, vertical = 6.dp),
    )
}
