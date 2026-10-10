@Serializable data class Detail(val id: String)

// Also needs an <intent-filter> for these URLs in AndroidManifest.xml
fun NavGraphBuilder.detailDestination() {
    composable<Detail>(
        deepLinks = listOf(
            // Route properties are appended as path segments: myapp://todo/{id}
            navDeepLink<Detail>(basePath = "myapp://todo"),
            navDeepLink<Detail>(basePath = "https://example.com/todo"),
        ),
    ) { entry ->
        DetailScreen(id = entry.toRoute<Detail>().id)
    }
}
