function EditScreen({ navigation }: Props) { // @link:fn
  const [dirty, setDirty] = useState(false); // @link:dirty

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => { // @link:intercept
        if (!dirty) return; // @link:guard
        e.preventDefault(); // @link:intercept
        Alert.alert('Discard changes?', undefined, [ // @link:dialog
          { text: 'Keep editing', style: 'cancel' }, // @link:keep
          { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) }, // @link:discard
        ]);
      }),
    [navigation, dirty],
  );

  return <EditForm onChange={() => setDirty(true)} />; // @link:form
}
