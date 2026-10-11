@Composable
fun DueLabel(due: LocalDate, cost: BigDecimal) { // @link:fn
    val locale = LocalConfiguration.current.locales[0]
    val date = remember(due, locale) { // @link:date
        due.format(DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM).withLocale(locale)) // @link:date
    }
    val price = remember(cost, locale) { // @link:price
        NumberFormat.getCurrencyInstance(locale) // @link:price
            .apply { currency = Currency.getInstance("USD") } // @link:price
            .format(cost)
    }

    // Row lays out right-to-left automatically in Arabic or Hebrew // @link:row
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) { // @link:row
        Text(date) // @link:date-text
        Text(price) // @link:price-text
    }
}
