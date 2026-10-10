struct CameraGate<Content: View>: View {
    @ViewBuilder let content: Content
    @State private var status = AVCaptureDevice.authorizationStatus(for: .video)
    @Environment(\.openURL) private var openURL
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        Group {
            switch status {
            case .authorized:
                content
            case .notDetermined:
                Button("Allow camera") {
                    Task {
                        _ = await AVCaptureDevice.requestAccess(for: .video)
                        status = AVCaptureDevice.authorizationStatus(for: .video)
                    }
                }
            default:
                Button("Enable camera in Settings") {
                    openURL(URL(string: UIApplication.openSettingsURLString)!)
                }
            }
        }
        // Re-check when returning from Settings
        .onChange(of: scenePhase) { _, phase in
            if phase == .active {
                status = AVCaptureDevice.authorizationStatus(for: .video)
            }
        }
    }
}
