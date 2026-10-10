function DueLabel({ due, cost }: { due: Date; cost: number }) {
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(due);
  const price = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(cost);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Text>{date}</Text>
      <Text>{price}</Text>
    </View>
  );
}
