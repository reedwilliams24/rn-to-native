function SaveButton({ todo }: { todo: Todo }) {
  const [saving, setSaving] = useState(false);

  const onPress = async () => {
    setSaving(true);
    try {
      await saveTodo(todo);
    } finally {
      setSaving(false);
    }
  };

  return <Button title={saving ? 'Saving…' : 'Save'} disabled={saving} onPress={onPress} />;
}
