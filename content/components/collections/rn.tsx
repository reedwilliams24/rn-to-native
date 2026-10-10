function TagList({ tags }: { tags: string[] }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {tags.map((tag) => (
        <Text key={tag}>#{tag}</Text>
      ))}
    </View>
  );
}
