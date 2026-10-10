// expo-file-system (SDK 54+)
function exportTodos(todos: Todo[]): File {
  const file = new File(Paths.document, 'export.json');
  file.write(JSON.stringify(todos));
  return file;
}

function cacheThumbnail(id: string, bytes: Uint8Array): File {
  const file = new File(Paths.cache, `thumb-${id}.jpg`);
  file.write(bytes);
  return file;
}
