import { useTranslation } from 'react-i18next';

// en.json
// {
//   "greeting": "Hello, {{name}}",
//   "todoCount_one": "{{count}} todo",
//   "todoCount_other": "{{count}} todos"
// }

function Header({ name, count }: { name: string; count: number }) {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('greeting', { name })}</Text>
      <Text>{t('todoCount', { count })}</Text>
    </View>
  );
}
