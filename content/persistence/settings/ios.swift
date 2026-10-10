struct HideCompletedToggle: View {
    // Reads and writes UserDefaults, and updates the view when the value changes
    @AppStorage("hideCompleted") private var hideCompleted = false

    var body: some View {
        Toggle("Hide completed", isOn: $hideCompleted)
    }
}
