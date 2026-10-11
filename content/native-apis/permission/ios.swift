// Info.plist: // @link:manifest
// NSCameraUsageDescription = "Scan receipts to attach them to a todo." // @link:manifest

struct ScanButton: View { // @link:fn
    let onScan: () -> Void

    var body: some View {
        Button("Scan receipt") { // @link:button,press
            Task {
                switch AVCaptureDevice.authorizationStatus(for: .video) { // @link:status
                case .authorized: // @link:granted
                    onScan()
                case .notDetermined:
                    if await AVCaptureDevice.requestAccess(for: .video) { onScan() } // @link:ask,asked-ok
                default:
                    break // denied or restricted: iOS won't show the prompt again
                }
            }
        }
    }
}
