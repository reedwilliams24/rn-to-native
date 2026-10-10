type SortOrder = 'newest' | 'oldest' | 'title';
const SORT_KEY = 'settings.sortOrder';

async function getSortOrder(): Promise<SortOrder> {
  return ((await AsyncStorage.getItem(SORT_KEY)) as SortOrder | null) ?? 'newest';
}

async function setSortOrder(order: SortOrder) {
  await AsyncStorage.setItem(SORT_KEY, order);
}
