struct User { // @link:type
    let name: String
    var nickname: String? = nil
}

func displayName(_ user: User?) -> String { // @link:display
    user?.nickname ?? user?.name ?? "Guest" // @link:coalesce
}

func initial(_ user: User?) -> String { // @link:initial
    guard let user else { return "?" } // unwrapped below // @link:guard
    return String(user.name.prefix(1)) // @link:narrow
}

func shortName(_ user: User?) -> String { // @link:short
    if let nickname = user?.nickname { // @link:chain
        return nickname.uppercased() // @link:chain
    }
    return "NONE" // @link:chain
}

// Crashes the app if nil
func forced(_ user: User?) -> String { user!.name } // @link:force
