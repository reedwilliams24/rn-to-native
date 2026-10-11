struct HideCompletedToggle: View { // @link:fn
    // Reads and writes UserDefaults, and updates the view when the value changes
    @AppStorage("hideCompleted") private var hideCompleted = false // @link:key,state,read,write

    var body: some View {
        Toggle("Hide completed", isOn: $hideCompleted) // @link:row,label,toggle
    }
}
