function SaveButton({ todo }: { todo: Todo }) {
  const [saving, setSaving] = useState(false);

  const onPress = async () => {
    setSaving(true);
    try {
      await api.save(todo);
    } finally {
      setSaving(false); // may run after unmount; React just ignores it
    }
  };

  return <Button title={saving ? 'Saving…' : 'Save'} disabled={saving} onPress={onPress} />;
}
