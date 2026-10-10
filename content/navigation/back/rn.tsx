function EditScreen({ navigation }: Props) {
  const [dirty, setDirty] = useState(false);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!dirty) return;
        e.preventDefault();
        Alert.alert('Discard changes?', undefined, [
          { text: 'Keep editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ]);
      }),
    [navigation, dirty],
  );

  return <EditForm onChange={() => setDirty(true)} />;
}
