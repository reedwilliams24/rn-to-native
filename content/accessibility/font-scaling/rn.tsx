function StatRow({ label, value }: { label: string; value: string }) {
  const { fontScale } = useWindowDimensions();
  const stacked = fontScale >= 1.5;
  const iconSize = 20 * fontScale;

  return (
    <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 8 }}>
      <CheckIcon size={iconSize} />
      <Text style={{ flex: stacked ? undefined : 1 }}>{label}</Text>
      <Text style={{ fontWeight: '600' }} maxFontSizeMultiplier={2}>
        {value}
      </Text>
    </View>
  );
}
