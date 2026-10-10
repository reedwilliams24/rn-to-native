data class User(
    val name: String,
    val nickname: String? = null,
)

fun displayName(user: User?): String =
    user?.nickname ?: user?.name ?: "Guest"

fun initial(user: User?): String {
    if (user == null) return "?"
    return user.name.take(1) // smart-cast to User
}

fun shortName(user: User?): String {
    // Unwrap or exit early
    val nickname = user?.nickname ?: return "NONE"
    return nickname.uppercase()
}

// Throws NullPointerException if null
fun forced(user: User?) = user!!.name
