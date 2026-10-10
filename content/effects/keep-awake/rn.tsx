import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

function RecipeScreen() {
  useEffect(() => {
    activateKeepAwakeAsync();
    return () => {
      deactivateKeepAwake();
    };
  }, []);

  return <RecipeSteps />;
}
