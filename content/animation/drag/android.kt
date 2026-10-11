@Composable
fun DraggableCard() { // @link:fn
    val offset = remember { Animatable(Offset.Zero, Offset.VectorConverter) } // @link:offset
    val scope = rememberCoroutineScope()

    Box(
        Modifier
            .offset { offset.value.round() } // read in layout, not composition // @link:apply
            .size(120.dp) // @link:card
            .background(MaterialTheme.colorScheme.primary, RoundedCornerShape(16.dp))
            .pointerInput(Unit) { // @link:gesture
                detectDragGestures( // @link:gesture
                    onDragEnd = { scope.launch { offset.animateTo(Offset.Zero, spring()) } }, // @link:end
                ) { change, dragAmount ->
                    change.consume()
                    scope.launch { offset.snapTo(offset.value + dragAmount) } // @link:update
                }
            },
    )
}
