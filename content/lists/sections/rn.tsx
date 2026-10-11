type TodoGroup = { title: string; data: Todo[] }; // @link:type

function TodoSections({ groups }: { groups: TodoGroup[] }) { // @link:fn
  return (
    <SectionList // @link:list
      sections={groups} // @link:groups
      keyExtractor={(t) => t.id} // @link:items
      renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>} // @link:header
      renderItem={({ item }) => <TodoRow todo={item} />} // @link:items
      stickySectionHeadersEnabled // @link:sticky
    />
  );
}
