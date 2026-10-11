// One JS thread: this loop blocks taps and JS-driven animations until it ends // @link:thread
async function exportCsv(todos: Todo[]): Promise<string> { // @link:fn
  setStatus('Exporting…'); // @link:status1
  const csv = todos.map((t) => `${t.id},${t.title},${t.done}`).join('\n'); // @link:csv
  const file = new File(Paths.document, 'todos.csv'); // @link:file
  file.write(csv); // the native side does the disk write // @link:write
  setStatus(`Saved ${file.name}`); // @link:status2
  return file.uri;
}
