function DueLabel({ due, cost }: { due: Date; cost: number }) { // @link:fn
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(due); // @link:date
  const price = new Intl.NumberFormat(undefined, { // @link:price
    style: 'currency',
    currency: 'USD', // @link:price
  }).format(cost);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>{/* @link:row */}
      <Text>{date}</Text>{/* @link:date-text */}
      <Text>{price}</Text>{/* @link:price-text */}
    </View>
  );
}
