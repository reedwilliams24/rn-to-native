@Composable
fun CompleteButton(onComplete: () -> Unit) { // @link:fn
    val haptics = LocalHapticFeedback.current // @link:import

    Button(onClick = { // @link:button,handler
        haptics.performHapticFeedback(HapticFeedbackType.Confirm) // @link:haptic
        onComplete() // @link:complete
    }) {
        Text("Complete") // @link:label
    }
}
