// Routes are types. Their properties are the params.
@Serializable object Home
@Serializable data class Detail(val id: String)

@Composable
fun App() {
    val navController = rememberNavController()

    NavHost(navController, startDestination = Home) {
        composable<Home> {
            HomeScreen(onOpen = { id -> navController.navigate(Detail(id)) })
        }
        composable<Detail> { entry ->
            val detail: Detail = entry.toRoute()
            DetailScreen(id = detail.id)
        }
    }
}
