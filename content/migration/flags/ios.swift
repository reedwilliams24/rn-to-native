// Later the native app is the shell, and the flag picks the legacy RN screen.
@Observable
final class FeatureFlags {
    var enabled: Set<String> = []

    func isEnabled(_ key: String) -> Bool { enabled.contains(key) }
}

struct ProfileScreen: View {
    @Environment(FeatureFlags.self) private var flags

    var body: some View {
        List {
            NavigationLink("Settings") {
                if flags.isEnabled("native_settings") {
                    SettingsScreen() // new SwiftUI screen
                } else {
                    ReactScreen(moduleName: "Settings") // legacy RN screen
                }
            }
        }
    }
}
