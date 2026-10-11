// MainActivity calls enableEdgeToEdge() before setContent { }
@Composable
fun ChatScreen() { // @link:fn
    Column( // @link:avoid
        Modifier
            .fillMaxSize() // @link:fill
            .systemBarsPadding() // status + navigation bars
            .imePadding(), // + the keyboard, when it's open // @link:avoid
    ) {
        MessageList(Modifier.weight(1f)) // @link:list
        Composer() // @link:composer
    }
}
