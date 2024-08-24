import { Alert } from 'react-native';
import { getDBPath } from '../../../src/utils';

import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

/**
 * Database connector
 */
class Database {
  DB: SQLite.SQLiteDatabase | null = null;
  basePath: string | null = null;

  transaction: Function = (callback: () => Promise<void>) =>
    this?.DB?.transaction(callback);

  executeSql: Function = async (sql: string, arg?: any[]): Promise<any[]> => {
    if (!this.DB) {
      Alert.alert("executeSql: can't re-connect to database");
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

      // not necessary
      this.basePath = await getDBPath(baseName);

      const params = {
        name: baseName,
        location: 'default',
      };

      SQLite.openDatabase(
        params,
        (DB) => {
          this.DB = DB;
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

  isTableExist = async (table: string = ''): Promise<boolean> => {
    const ifExist = await this.executeSql(
      `SELECT EXISTS(SELECT name FROM sqlite_master WHERE type='table' AND name='${table}') as exist`
    );
    return !!ifExist?.[0]?.rows?.item(0)?.exist ?? false;
  };
}

export default new Database();
