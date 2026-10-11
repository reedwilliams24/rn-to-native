// Later the native app is the shell, and the flag picks the legacy RN screen. // @link:shell
@Observable
final class FeatureFlags {
    var enabled: Set<String> = []

    func isEnabled(_ key: String) -> Bool { enabled.contains(key) } // @link:iface
}

struct ProfileScreen: View {
    @Environment(FeatureFlags.self) private var flags

    var body: some View {
        List {
            NavigationLink("Settings") { // @link:fn
                if flags.isEnabled("native_settings") { // @link:check
                    SettingsScreen() // new SwiftUI screen // @link:new
                } else {
                    ReactScreen(moduleName: "Settings") // legacy RN screen // @link:legacy
                }
            }
        }
    }
}
