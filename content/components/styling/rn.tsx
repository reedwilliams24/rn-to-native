type ChipProps = { // @link:props
  label: string; // @link:label
  style?: StyleProp<ViewStyle>; // @link:style-param
};

function Chip({ label, style }: ChipProps) { // @link:fn
  return ( // @link:body
    <View style={[styles.chip, style]}>{/* @link:container,style-param */}
      <Text style={styles.label}>{label}</Text>{/* @link:text */}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12, // @link:padding
    paddingVertical: 6, // @link:padding
    borderRadius: 16, // @link:background
    backgroundColor: '#E8F0FE', // @link:background
  },
  label: { fontSize: 14, fontWeight: '600', color: '#1A56DB' }, // @link:font,color
});
