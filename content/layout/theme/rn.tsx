const theme = {
  colors: { brand: '#1A56DB', brandSoft: '#E8F0FE' },
  spacing: { sm: 8, md: 16 },
};
const ThemeContext = createContext(theme);

function Tag({ label }: { label: string }) {
  const { colors, spacing } = useContext(ThemeContext);
  return (
    <Text
      style={{
        color: colors.brand,
        backgroundColor: colors.brandSoft,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        fontWeight: '600',
      }}
    >
      {label}
    </Text>
  );
}
