struct CameraGate<Content: View>: View { // @link:fn
    @ViewBuilder let content: Content
    @State private var status = AVCaptureDevice.authorizationStatus(for: .video) // @link:status
    @Environment(\.openURL) private var openURL
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        Group {
            switch status {
            case .authorized: // @link:granted
                content // @link:granted
            case .notDetermined: // @link:ask
                Button("Allow camera") { // @link:ask
                    Task {
                        _ = await AVCaptureDevice.requestAccess(for: .video)
                        status = AVCaptureDevice.authorizationStatus(for: .video)
                    }
                }
            default: // @link:denied
                Button("Enable camera in Settings") { // @link:settings
                    openURL(URL(string: UIApplication.openSettingsURLString)!) // @link:settings
                }
            }
        }
        // Re-check when returning from Settings // @link:recheck
        .onChange(of: scenePhase) { _, phase in // @link:recheck
            if phase == .active {
                status = AVCaptureDevice.authorizationStatus(for: .video)
            }
        }
    }
}
