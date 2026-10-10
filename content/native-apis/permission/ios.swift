// Info.plist:
// NSCameraUsageDescription = "Scan receipts to attach them to a todo."

struct ScanButton: View {
    let onScan: () -> Void

    var body: some View {
        Button("Scan receipt") {
            Task {
                switch AVCaptureDevice.authorizationStatus(for: .video) {
                case .authorized:
                    onScan()
                case .notDetermined:
                    if await AVCaptureDevice.requestAccess(for: .video) { onScan() }
                default:
                    break // denied or restricted: iOS won't show the prompt again
                }
            }
        }
    }
}
