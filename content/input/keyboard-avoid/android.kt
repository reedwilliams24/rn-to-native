// MainActivity calls enableEdgeToEdge() before setContent { }
@Composable
fun ChatScreen() {
    Column(
        Modifier
            .fillMaxSize()
            .systemBarsPadding() // status + navigation bars
            .imePadding(), // + the keyboard, when it's open
    ) {
        MessageList(Modifier.weight(1f))
        Composer()
    }
}
