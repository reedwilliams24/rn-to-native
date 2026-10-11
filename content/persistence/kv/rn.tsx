type SortOrder = 'newest' | 'oldest' | 'title'; // @link:type
const SORT_KEY = 'settings.sortOrder'; // @link:key

async function getSortOrder(): Promise<SortOrder> { // @link:read
  return ((await AsyncStorage.getItem(SORT_KEY)) as SortOrder | null) ?? 'newest'; // @link:read,default
}

async function setSortOrder(order: SortOrder) { // @link:write
  await AsyncStorage.setItem(SORT_KEY, order); // @link:write
}
