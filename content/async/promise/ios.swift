@MainActor
@Observable
final class ProfileModel {
    private(set) var profile: Profile?
    private let api: API

    init(api: API) { self.api = api }

    // `async throws`: may suspend, may fail. Callers must write `try await`.
    func loadProfile(userId: String) async throws -> Profile {
        let user = try await api.getUser(userId)
        let avatar = try await api.getAvatar(user.avatarID)
        return Profile(name: user.name, avatarURL: avatar.url)
    }

    func refresh(userId: String) async {
        do {
            profile = try await loadProfile(userId: userId)
        } catch {
            print("Profile failed: \(error)")
        }
    }
}
