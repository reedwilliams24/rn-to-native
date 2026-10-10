type ChipProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
};

function Chip({ label, style }: ChipProps) {
  return (
    <View style={[styles.chip, style]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E8F0FE',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#1A56DB' },
});
