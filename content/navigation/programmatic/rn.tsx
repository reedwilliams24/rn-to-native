type RootStack = { Home: undefined; Detail: { id: string }; Settings: undefined }; // @link:routes

function useRouter() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>(); // @link:nav
  return {
    openDetail: (id: string) => navigation.navigate('Detail', { id }), // @link:detail
    openSettings: () => navigation.navigate('Settings'), // @link:settings
    goBack: () => navigation.goBack(), // @link:back
    popToRoot: () => navigation.popToTop(), // @link:root
  };
}
