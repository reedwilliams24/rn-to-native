function StatRow({ label, value }: { label: string; value: string }) { // @link:fn
  const { fontScale } = useWindowDimensions(); // @link:scale
  const stacked = fontScale >= 1.5; // @link:stacked
  const iconSize = 20 * fontScale; // @link:icon-size

  return (
    <View style={{ flexDirection: stacked ? 'column' : 'row', gap: 8 }}>{/* @link:layout */}
      <CheckIcon size={iconSize} />{/* @link:icon */}
      <Text style={{ flex: stacked ? undefined : 1 }}>{label}</Text>{/* @link:label */}
      <Text style={{ fontWeight: '600' }} maxFontSizeMultiplier={2}>{/* @link:cap */}
        {value}
      </Text>
    </View>
  );
}
