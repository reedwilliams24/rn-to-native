function Stat({ value, label }: { value: string; label: string }) { // @link:fn
  const { fontScale } = useWindowDimensions(); // @link:scale
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{/* @link:row */}
      <Icon name="star" size={20 * fontScale} />{/* @link:icon */}
      <Text style={{ fontSize: 17 }}>{value}</Text>{/* @link:value */}
      <Text style={{ fontSize: 13, color: 'gray' }} maxFontSizeMultiplier={1.5}>{/* @link:label,cap */}
        {label}{/* @link:label */}
      </Text>
    </View>
  );
}
