@Serializable object Home
@Serializable data class Detail(val id: String)
@Serializable object Settings

// The NavController owns the back stack. You send it commands.
class Router(private val nav: NavController) {
    fun openDetail(id: String) = nav.navigate(Detail(id))
    fun openSettings() = nav.navigate(Settings)
    fun goBack() = nav.popBackStack()
    fun popToRoot() = nav.popBackStack(Home, inclusive = false)
}

// After login: open Home and drop Login, so Back doesn't return to it
// nav.navigate(Home) { popUpTo<Login> { inclusive = true } }
