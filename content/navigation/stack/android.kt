// Routes are types. Their properties are the params.
@Serializable object Home // @link:routes
@Serializable data class Detail(val id: String) // @link:routes

@Composable
fun App() {
    val navController = rememberNavController() // @link:stack

    NavHost(navController, startDestination = Home) { // @link:host,start
        composable<Home> { // @link:home
            HomeScreen(onOpen = { id -> navController.navigate(Detail(id)) }) // @link:push
        }
        composable<Detail> { entry -> // @link:detail
            val detail: Detail = entry.toRoute() // @link:params
            DetailScreen(id = detail.id) // @link:detail
        }
    }
}
