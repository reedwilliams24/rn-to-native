import { useTranslation } from 'react-i18next'; // @link:lib

// en.json // @link:file
// {
//   "greeting": "Hello, {{name}}", // @link:greeting-str
//   "todoCount_one": "{{count}} todo", // @link:plural-str
//   "todoCount_other": "{{count}} todos"
// }

function Header({ name, count }: { name: string; count: number }) { // @link:fn
  const { t } = useTranslation(); // @link:lib

  return (
    <View>
      <Text>{t('greeting', { name })}</Text>{/* @link:greeting */}
      <Text>{t('todoCount', { count })}</Text>{/* @link:plural */}
    </View>
  );
}
