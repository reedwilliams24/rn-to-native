struct SettingRow: View { // @link:fn,props
    let label: String // @link:label
    @Binding var isOn: Bool // read *and* write the parent's state // @link:value,onchange

    var body: some View {
        Toggle(label, isOn: $isOn) // @link:row,text,switch
    }
}

struct Settings: View { // @link:settings
    @State private var notifications = true // @link:state

    var body: some View {
        // $notifications passes a Binding, not a copy of the Bool
        SettingRow(label: "Notifications", isOn: $notifications) // @link:use
    }
}
