@Composable
fun SettingRow( // @link:fn,props
    label: String, // @link:label
    checked: Boolean, // @link:value
    onCheckedChange: (Boolean) -> Unit, // @link:onchange
) {
    Row(verticalAlignment = Alignment.CenterVertically) { // @link:row
        Text(label, modifier = Modifier.weight(1f)) // @link:text
        Switch(checked = checked, onCheckedChange = onCheckedChange) // @link:switch
    }
}

@Composable
fun Settings() { // @link:settings
    var notifications by remember { mutableStateOf(true) } // @link:state
    SettingRow( // @link:use
        label = "Notifications", // @link:use
        checked = notifications, // @link:use
        onCheckedChange = { notifications = it }, // @link:use
    )
}
