struct User {
    let name: String
    var nickname: String? = nil
}

func displayName(_ user: User?) -> String {
    user?.nickname ?? user?.name ?? "Guest"
}

func initial(_ user: User?) -> String {
    guard let user else { return "?" } // unwrapped below
    return String(user.name.prefix(1))
}

func shortName(_ user: User?) -> String {
    if let nickname = user?.nickname {
        return nickname.uppercased()
    }
    return "NONE"
}

// Crashes the app if nil
func forced(_ user: User?) -> String { user!.name }
