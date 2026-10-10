@Composable
fun DraggableCard() {
    val offset = remember { Animatable(Offset.Zero, Offset.VectorConverter) }
    val scope = rememberCoroutineScope()

    Box(
        Modifier
            .offset { offset.value.round() } // read in layout, not composition
            .size(120.dp)
            .background(MaterialTheme.colorScheme.primary, RoundedCornerShape(16.dp))
            .pointerInput(Unit) {
                detectDragGestures(
                    onDragEnd = { scope.launch { offset.animateTo(Offset.Zero, spring()) } },
                ) { change, dragAmount ->
                    change.consume()
                    scope.launch { offset.snapTo(offset.value + dragAmount) }
                }
            },
    )
}
