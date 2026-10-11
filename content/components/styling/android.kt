@Composable // @link:fn
fun Chip( // @link:fn,props
    label: String, // @link:label
    modifier: Modifier = Modifier, // @link:style-param
) {
    Text( // @link:text
        text = label, // @link:text
        fontSize = 14.sp, // @link:font
        fontWeight = FontWeight.SemiBold, // @link:font
        color = Color(0xFF1A56DB), // @link:color
        modifier = modifier // @link:container,style-param
            // outer → inner: background first, then padding inside it
            .background(Color(0xFFE8F0FE), RoundedCornerShape(16.dp)) // @link:background
            .padding(horizontal = 12.dp, vertical = 6.dp), // @link:padding
    )
}
