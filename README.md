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
  // initial baseName that you used in params or taken from openDatabase success callback:
  // SQLite.openDatabase({ name: baseName, location: 'default' }, DB => { DB.dbname <-- your baseName also here
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
