// expo-file-system (SDK 54+)
function exportTodos(todos: Todo[]): File { // @link:export
  const file = new File(Paths.document, 'export.json'); // @link:exportpath
  file.write(JSON.stringify(todos)); // @link:exportwrite
  return file; // @link:exportret
}

function cacheThumbnail(id: string, bytes: Uint8Array): File { // @link:cache
  const file = new File(Paths.cache, `thumb-${id}.jpg`); // @link:cachepath
  file.write(bytes); // @link:cachewrite
  return file; // @link:cacheret
}
