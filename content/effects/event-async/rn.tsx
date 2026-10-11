function SaveButton({ todo }: { todo: Todo }) { // @link:fn
  const [saving, setSaving] = useState(false); // @link:state

  const onPress = async () => { // @link:handler
    setSaving(true); // @link:start
    try { // @link:try
      await saveTodo(todo); // @link:save
    } finally { // @link:finally
      setSaving(false); // @link:finish
    }
  };

  return <Button title={saving ? 'Saving…' : 'Save'} disabled={saving} onPress={onPress} />; // @link:button,label,disabled
}
