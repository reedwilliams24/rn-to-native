// iOS has no in-app update API. Compare versions yourself and link to the store.
@MainActor @Observable
final class UpdateGate {
    var isUpdateRequired = false

    // minimumVersion comes from your remote config / API, e.g. "1.4.0"
    func check(minimumVersion: String) {
        let current = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "0"
        isUpdateRequired = current.compare(minimumVersion, options: .numeric) == .orderedAscending
    }
}

struct RootView: View {
    @State private var gate = UpdateGate()
    @Environment(\.openURL) private var openURL

    var body: some View {
        ContentView()
            .task { gate.check(minimumVersion: await RemoteConfig.minimumVersion()) }
            .fullScreenCover(isPresented: $gate.isUpdateRequired) {
                ContentUnavailableView {
                    Label("Update required", systemImage: "arrow.down.app")
                } actions: {
                    Button("Open App Store") {
                        openURL(URL(string: "https://apps.apple.com/app/id1234567890")!)
                    }
                }
                .interactiveDismissDisabled()
            }
    }
}
