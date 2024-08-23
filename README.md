# react-native-sqlite-explorer

Explorer for react-native-sqlite-storage library database inside react native app

## Installation

```sh
npm install react-native-sqlite-explorer
```

## Usage

```js
import SQLiteExplorer from 'react-native-sqlite-explorer';

const DBExplorer = () => {
  // your baseName that you used in params:
  // SQLite.openDatabase({ name: baseName, location: 'default' }....
  const baseName = '<your_base_name_here>';

  return <SQLiteExplorer params={{ name: baseName, location: 'default' }} />;
};

export default DBExplorer;
```

## Tips

Temporarily only for Android

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
