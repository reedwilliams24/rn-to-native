import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

function RecipeScreen() { // @link:fn
  useEffect(() => { // @link:effect
    activateKeepAwakeAsync(); // @link:on
    return () => { // @link:cleanup
      deactivateKeepAwake(); // @link:off
    };
  }, []);

  return <RecipeSteps />; // @link:content
}
