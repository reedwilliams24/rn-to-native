@Composable
fun SettingRow(
    label: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Text(label, modifier = Modifier.weight(1f))
        Switch(checked = checked, onCheckedChange = onCheckedChange)
    }
}

@Composable
fun Settings() {
    var notifications by remember { mutableStateOf(true) }
    SettingRow(
        label = "Notifications",
        checked = notifications,
        onCheckedChange = { notifications = it },
    )
}
