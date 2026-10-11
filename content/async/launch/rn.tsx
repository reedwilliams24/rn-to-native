function SaveButton({ todo }: { todo: Todo }) { // @link:fn
  const [saving, setSaving] = useState(false); // @link:state

  const onPress = async () => { // @link:handler
    setSaving(true); // @link:start
    try { // @link:try
      await api.save(todo); // @link:save
    } finally { // @link:finally
      setSaving(false); // may run after unmount; React just ignores it // @link:finish
    }
  };

  return <Button title={saving ? 'Saving…' : 'Save'} disabled={saving} onPress={onPress} />; // @link:button,label,disabled
}
