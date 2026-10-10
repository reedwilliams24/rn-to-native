@Composable
fun DueLabel(due: LocalDate, cost: BigDecimal) {
    val locale = LocalConfiguration.current.locales[0]
    val date = remember(due, locale) {
        due.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM).withLocale(locale))
    }
    val price = remember(cost, locale) {
        NumberFormat.getCurrencyInstance(locale)
            .apply { currency = Currency.getInstance("USD") }
            .format(cost)
    }

    // Row lays out right-to-left automatically in Arabic or Hebrew
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(date)
        Text(price)
    }
}
