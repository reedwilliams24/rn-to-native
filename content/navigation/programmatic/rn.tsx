type RootStack = { Home: undefined; Detail: { id: string }; Settings: undefined };

function useRouter() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStack>>();
  return {
    openDetail: (id: string) => navigation.navigate('Detail', { id }),
    openSettings: () => navigation.navigate('Settings'),
    goBack: () => navigation.goBack(),
    popToRoot: () => navigation.popToTop(),
  };
}
