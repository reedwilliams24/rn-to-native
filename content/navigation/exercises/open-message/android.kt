// Routes are types; their properties are the params.
@Serializable object Inbox
@Serializable data class Message(val id: String)

@Composable
fun MailApp() {
    val nav = /*[*/rememberNavController()/*]*/

    NavHost(nav, startDestination = Inbox) {
        composable<Inbox> {
            Button(onClick = {
                nav./*[*/navigate(Message("a"))/*]*/
            }) { Text("Open") }
        }
        composable</*[*/Message/*]*/> { entry ->
            val msg: Message = entry./*[*/toRoute()/*]*/
            Column {
                Text("Message ${msg.id}")
                Button(onClick = {
                    nav./*[*/popBackStack()/*]*/
                }) { Text("Back") }
            }
        }
    }
}
