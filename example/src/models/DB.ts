import { Alert } from 'react-native';
// import { getDBPath } from '../../../src/utils';

// https://op-engineering.github.io/op-sqlite/docs/installation
import { DB, open, QueryResult } from '@op-engineering/op-sqlite';

// TODO?
//SQLite.DEBUG(false);
//SQLite.enablePromise(true);

/**
 * Database connector
 */
class Database {
  DB: DB | null = null;
  basePath: string | null = null;

  transaction = (callback: () => Promise<void>) =>
    this?.DB?.transaction(callback);

  executeSql = async (
    sql: string,
    arg?: any[]
  ): Promise<QueryResult['rows'] | null> => {
    if (!this.DB) {
      Alert.alert("executeSql: can't re-connect to database");
      return null;
    }
    let sqlRes: QueryResult;
    try {
      sqlRes = (await this.DB.execute(sql, arg)) as QueryResult;
    } catch (sqlError: any) {
      if (!!sqlError?.message) {
        Alert.alert(sqlError.message.substr(0, 450));
        // @ts-ignore
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
      this.DB = open({
        name: baseName,
      });

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
      } catch {}
      this.DB = null;
      return resolve();
    });
  };

  isTableExist = async (table: string = ''): Promise<boolean> => {
    if (!this.DB) return false;
    const ifExist = await this.executeSql(
      `SELECT EXISTS(SELECT name FROM sqlite_master WHERE type='table' AND name='${table}') as exist`
    );
    return !!ifExist?.[0]?.exist || false;
  };
}

export default new Database();
