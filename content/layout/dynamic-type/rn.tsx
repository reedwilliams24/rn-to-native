function Stat({ value, label }: { value: string; label: string }) {
  const { fontScale } = useWindowDimensions();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Icon name="star" size={20 * fontScale} />
      <Text style={{ fontSize: 17 }}>{value}</Text>
      <Text style={{ fontSize: 13, color: 'gray' }} maxFontSizeMultiplier={1.5}>
        {label}
      </Text>
    </View>
  );
}
