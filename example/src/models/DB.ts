// версия с шифрованием - https://github.com/axsy-dev/react-native-sqlcipher-storage
import { Alert } from 'react-native';
import { getDBPath } from '../../../src/utils';

import SQLite from 'react-native-sqlite-storage'; // sselect sqlite_version()    -   "3.22.0"

// SQLite.DEBUG(process.env.NODE_ENV !== 'production');
SQLite.DEBUG(false);
SQLite.enablePromise(true);

/**
 * Коннектор к базе данных
 */
class Database {
  DB: SQLite.SQLiteDatabase | null = null;
  basePath: string | null = null;

  transaction: Function = (callback: () => Promise<void>) =>
    this?.DB?.transaction(callback);

  // сделаю свое логирование ошибок на проде
  executeSql: Function = async (sql: string, arg?: any[]): Promise<any[]> => {
    // если вдруг подключение пропало, попытаюсь его восстановить
    if (!this.DB) {
      Alert.alert('executeSql: Не удалось переподключиться к базе');
      return [];
    }

    let sqlRes;
    try {
      sqlRes = await this.DB.executeSql(sql, arg);
    } catch (sqlError: any) {
      if (!!sqlError?.message) {
        Alert.alert(sqlError.message.substr(0, 450));

        if (process.env.NODE_ENV !== 'production') {
          console.log('sqlError.message', sqlError.message);
        }
      }

      throw new Error(sqlError?.message ?? 'SQL ERROR');
    }

    return sqlRes;
  };

  isOpen = (): boolean => !!this.DB;

  open = (baseName: string = '') => {
    return new Promise<SQLite.SQLiteDatabase>(async (resolve, reject) => {
      if (!!this.DB) {
        return resolve(this.DB);
      }

      // не обязательно
      this.basePath = await getDBPath(baseName);

      const params = {
        name: baseName,
        location: 'default',
      };

      SQLite.openDatabase(
        params,
        (DB) => {
          this.DB = DB;
          // Нужно включить внешние ключи
          this.executeSql('PRAGMA foreign_keys = ON').then(() => {
            return resolve(DB);
          });
        },
        (error) => {
          Alert.alert('error', error.message);
          reject();
        }
      );
    });
  };

  closeDatabase = async () => {
    return new Promise<void>(async (resolve) => {
      if (!this.DB) {
        return resolve();
      }

      try {
        await this.DB.close();
      } catch (error) {}

      this.DB = null;

      return resolve();
    });
  };
}

export default new Database();
