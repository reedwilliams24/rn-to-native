struct SettingRow: View {
    let label: String
    @Binding var isOn: Bool // read *and* write the parent's state

    var body: some View {
        Toggle(label, isOn: $isOn)
    }
}

struct Settings: View {
    @State private var notifications = true

    var body: some View {
        // $notifications passes a Binding, not a copy of the Bool
        SettingRow(label: "Notifications", isOn: $notifications)
    }
}
