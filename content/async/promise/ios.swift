@MainActor
@Observable
final class ProfileModel { // @link:model
    private(set) var profile: Profile? // @link:state
    private let api: API

    init(api: API) { self.api = api }

    // `async throws`: may suspend, may fail. Callers must write `try await`.
    func loadProfile(userId: String) async throws -> Profile { // @link:load
        let user = try await api.getUser(userId) // @link:user
        let avatar = try await api.getAvatar(user.avatarID) // @link:avatar
        return Profile(name: user.name, avatarURL: avatar.url) // @link:result
    }

    func refresh(userId: String) async { // @link:refresh
        do { // @link:try
            profile = try await loadProfile(userId: userId) // @link:assign
        } catch { // @link:catch
            print("Profile failed: \(error)") // @link:log
        }
    }
}
