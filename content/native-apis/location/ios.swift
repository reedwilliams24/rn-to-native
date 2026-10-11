// Info.plist: NSLocationWhenInUseUsageDescription // @link:manifest
@Observable @MainActor
final class LocationModel {
    var coordinate: CLLocationCoordinate2D?
    @ObservationIgnored private let manager = CLLocationManager() // @link:import

    func locateOnce() async { // @link:fn
        manager.requestWhenInUseAuthorization() // @link:ask
        do {
            for try await update in CLLocationUpdate.liveUpdates() { // @link:fetch
                if let location = update.location {
                    coordinate = location.coordinate // @link:result
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
