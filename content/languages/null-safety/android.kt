data class User( // @link:type
    val name: String,
    val nickname: String? = null,
)

fun displayName(user: User?): String = // @link:display
    user?.nickname ?: user?.name ?: "Guest" // @link:coalesce

fun initial(user: User?): String { // @link:initial
    if (user == null) return "?" // @link:guard
    return user.name.take(1) // smart-cast to User // @link:narrow
}

fun shortName(user: User?): String { // @link:short
    // Unwrap or exit early
    val nickname = user?.nickname ?: return "NONE" // @link:chain
    return nickname.uppercase() // @link:chain
}

// Throws NullPointerException if null
fun forced(user: User?) = user!!.name // @link:force
