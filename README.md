# react-native-sqlite-explorer

Explorer for react-native-sqlite-storage inside react native app

## Installation

```sh
npm install react-native-sqlite-explorer
```

## Usage

```js
import SQLiteExplorer from 'react-native-sqlite-explorer';

const SQLiteExplorerScreen = () => {
  // initial baseName that you used in params or taken from openDatabase success callback:
  // SQLite.openDatabase({ name: baseName, location: 'default' }, DB => { DB.dbname <-- your baseName also here
  const baseName = '<your_base_name_here>';

  return <SQLiteExplorer params={{ name: baseName, location: 'default' }} />;
};

export default SQLiteExplorerScreen;
```

## Tips

Temporarily only for Android

![Example 1](/src/assets/example-1.jpg)
![Example 2](/src/assets/example-2.jpg)

![Example 3](/src/assets/example-3.jpg)
![Example 4](/src/assets/example-4.jpg)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
