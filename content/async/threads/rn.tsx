// One JS thread: this loop blocks taps and JS-driven animations until it ends
async function exportCsv(todos: Todo[]): Promise<string> {
  setStatus('Exporting…');
  const csv = todos.map((t) => `${t.id},${t.title},${t.done}`).join('\n');
  const file = new File(Paths.document, 'todos.csv');
  file.write(csv); // the native side does the disk write
  setStatus(`Saved ${file.name}`);
  return file.uri;
}
