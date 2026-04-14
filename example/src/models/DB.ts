import { Alert } from 'react-native';
import { getDBPath } from '../../../src/utils';

import { DB, open as openDB } from '@op-engineering/op-sqlite';

// TODO?
//SQLite.DEBUG(false);
//SQLite.enablePromise(true);

/**
 * Database connector
 */
class Database {
  DB: DB | null = null;
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
      sqlRes = await this.DB.execute(sql, arg);
    } catch (sqlError: any) {
      if (!!sqlError?.message) {
        Alert.alert(sqlError.message.substr(0, 450));

        if (process.env.NODE_ENV !== 'production') {
          console.log('sqlError.message', sqlError.message);
        }
      }

      throw new Error(sqlError?.message ?? 'SQL ERROR');
    }

    return sqlRes.rows;
  };

  isOpen = (): boolean => !!this.DB;

  open = (baseName: string = '') => {
    return new Promise<void>(async (resolve, reject) => {
      if (!!this.DB) {
        return resolve();
      }

      // not necessary
      this.basePath = await getDBPath(baseName);

      const params = {
        name: baseName,
        location: 'default',
      };

      this.DB = openDB(params);

      // Нужно включить внешние ключи
      this.executeSql('PRAGMA foreign_keys = ON')
        .then(() => {
          return resolve();
        })
        .catch((error: any) => {
          Alert.alert('error', error?.message);
          return reject();
        });
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
    ifExist;
    return !!ifExist?.rows?.item(0)?.exist ?? false;
  };
}

export default new Database();
