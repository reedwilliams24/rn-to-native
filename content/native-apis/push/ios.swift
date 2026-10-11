// Signing & Capabilities: Push Notifications // @link:import
final class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions options: [UIApplication.LaunchOptionsKey: Any]? = nil // @link:register
    ) -> Bool {
        Task {
            let center = UNUserNotificationCenter.current()
            if try await center.requestAuthorization(options: [.alert, .badge, .sound]) { // @link:ask
                application.registerForRemoteNotifications() // @link:register
            }
        }
        return true
    }

    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data // @link:token,refresh
    ) {
        let token = deviceToken.map { String(format: "%02x", $0) }.joined() // @link:token
        Task { await api.registerDevice(token) } // @link:send
    }
}

@main
struct TodoApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    var body: some Scene { WindowGroup { ContentView() } }
}
