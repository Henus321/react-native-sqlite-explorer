import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { getDatabasePath } from '../../src/utils';
import SQLiteExplorer from 'react-native-sqlite-explorer';
import DB from './models/DB';

const defaultBasePrefix = 'defaultBasePrefix';
const defaultBasePostfix = '1';

export default function App() {
  const [path, setPath] = useState('');
  const [opened, setOpened] = useState(false);
  const baseName = defaultBasePrefix + '-' + defaultBasePostfix;

  useEffect(() => {
    loadBase();
  }, []);
  
  const loadBase = async (): Promise<void> => {
    setPath((await getDatabasePath(baseName)) || "can't find path");

    // инициализирую подключение к базе
    try {
      await DB.open(baseName);
      setOpened(true);
    } catch (error: any) {
      Alert.alert(
        'Внимание',
        'Не удалось открыть базу данных: ' + error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      {opened ? (
        <SQLiteExplorer params={{ name: baseName }} />
      ) : (
        <Text>Loading from {path}...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});
