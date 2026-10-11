@Serializable data class Detail(val id: String) // @link:route

// Also needs an <intent-filter> for these URLs in AndroidManifest.xml // @link:register
fun NavGraphBuilder.detailDestination() {
    composable<Detail>( // @link:route
        deepLinks = listOf( // @link:config
            // Route properties are appended as path segments: myapp://todo/{id}
            navDeepLink<Detail>(basePath = "myapp://todo"), // @link:prefixes
            navDeepLink<Detail>(basePath = "https://example.com/todo"), // @link:prefixes
        ),
    ) { entry ->
        DetailScreen(id = entry.toRoute<Detail>().id) // @link:screen
    }
}
