// Info.plist: NSLocationWhenInUseUsageDescription
@Observable @MainActor
final class LocationModel {
    var coordinate: CLLocationCoordinate2D?
    @ObservationIgnored private let manager = CLLocationManager()

    func locateOnce() async {
        manager.requestWhenInUseAuthorization()
        do {
            for try await update in CLLocationUpdate.liveUpdates() {
                if let location = update.location {
                    coordinate = location.coordinate
                    break // stop updates after the first fix
                }
            }
        } catch {
            coordinate = nil
        }
    }
}

// In a view:
// Button("Todos near me") { Task { await model.locateOnce() } }
