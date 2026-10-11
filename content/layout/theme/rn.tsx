const theme = { // @link:theme
  colors: { brand: '#1A56DB', brandSoft: '#E8F0FE' }, // @link:colors
  spacing: { sm: 8, md: 16 }, // @link:spacing
};
const ThemeContext = createContext(theme); // @link:provide

function Tag({ label }: { label: string }) { // @link:tag
  const { colors, spacing } = useContext(ThemeContext); // @link:read
  return (
    <Text // @link:text
      style={{
        color: colors.brand, // @link:fg
        backgroundColor: colors.brandSoft, // @link:bg
        paddingHorizontal: spacing.md, // @link:padh
        paddingVertical: spacing.sm, // @link:padv
        borderRadius: 8,
        fontWeight: '600',
      }}
    >
      {label}{/* @link:label */}
    </Text>
  );
}
