@Composable
fun CompleteButton(onComplete: () -> Unit) {
    val haptics = LocalHapticFeedback.current

    Button(onClick = {
        haptics.performHapticFeedback(HapticFeedbackType.Confirm)
        onComplete()
    }) {
        Text("Complete")
    }
}
