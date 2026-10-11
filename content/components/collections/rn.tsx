function TagList({ tags }: { tags: string[] }) { // @link:fn,param
  return ( // @link:body
    <View style={{ flexDirection: 'row', gap: 8 }}>{/* @link:row */}
      {tags.map((tag) => ( // @link:loop
        <Text key={tag}>#{tag}</Text> // @link:item,key
      ))}
    </View>
  );
}
