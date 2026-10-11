@Serializable object Home // @link:routes
@Serializable data class Detail(val id: String) // @link:routes
@Serializable object Settings // @link:routes

// The NavController owns the back stack. You send it commands.
class Router(private val nav: NavController) { // @link:nav
    fun openDetail(id: String) = nav.navigate(Detail(id)) // @link:detail
    fun openSettings() = nav.navigate(Settings) // @link:settings
    fun goBack() = nav.popBackStack() // @link:back
    fun popToRoot() = nav.popBackStack(Home, inclusive = false) // @link:root
}

// After login: open Home and drop Login, so Back doesn't return to it
// nav.navigate(Home) { popUpTo<Login> { inclusive = true } }
