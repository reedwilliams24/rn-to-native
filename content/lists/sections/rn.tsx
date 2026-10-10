type TodoGroup = { title: string; data: Todo[] };

function TodoSections({ groups }: { groups: TodoGroup[] }) {
  return (
    <SectionList
      sections={groups}
      keyExtractor={(t) => t.id}
      renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
      renderItem={({ item }) => <TodoRow todo={item} />}
      stickySectionHeadersEnabled
    />
  );
}
