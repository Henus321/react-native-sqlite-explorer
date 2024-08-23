import { Alert } from 'react-native';
import { DBParamsType, TableSignature, TableSignatureValue } from '../types';
import SQLite, { ResultSet } from 'react-native-sqlite-storage'; // sselect sqlite_version()    -   "3.22.0"
import { tryParse, getErrorText } from '../utils';
import _ from 'lodash';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

/**
 * Коннектор к базе данных
 */
class Database {
  DB: SQLite.SQLiteDatabase | null = null;
  basePath: string | null = null;
  error: string = '';
  transaction: Function = (callback: () => Promise<void>) =>
    this?.DB?.transaction(callback);

  // сделаю свое логирование ошибок на проде
  executeSql: Function = async (sql: string, arg?: any[]): Promise<any[]> => {
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

  open = ({ name, location = 'default' }: DBParamsType) => {
    return new Promise<SQLite.SQLiteDatabase>(async (resolve, reject) => {
      if (!!this.DB) return resolve(this.DB);

      SQLite.openDatabase(
        {
          name: name,
          location,
        },
        (DB) => {
          this.DB = DB;

          // Нужно включить внешние ключи
          this.executeSql('PRAGMA foreign_keys = ON').then(() => {
            return resolve(DB);
          });
        },
        reject
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

  setError = (error: string) => {
    this.error = error;
  };

  getDateTime = async () => {
    try {
      const sqltime = await this.executeSql(
        "SELECT datetime('now', 'localtime') as dt"
      );
      return sqltime?.[0]?.rows?.item(0).dt;
    } catch (error: any) {
      return error?.message || 'error';
    }
  };

  getCountOfRecords = async (
    table: string,
    where: string | null = null
  ): Promise<number> => {
    const results = await this.executeSql(
      `SELECT COUNT(*) as _count FROM ${table} ${!!where ? ' WHERE ' + where : ''}`
    );
    return results?.[0]?.rows?.item(0)?._count || 0;
  };

  isTableExist = async (table: string = ''): Promise<boolean> => {
    const ifExist = await this.executeSql(
      `SELECT EXISTS(SELECT name FROM sqlite_master WHERE type='table' AND name='${table}') as exist`
    );
    return !!ifExist?.[0]?.rows?.item(0)?.exist ?? false;
  };

  getTablesSignature = async (): Promise<TableSignature[] | null> => {
    try {
      let tableFields = await this.executeSql(`
			SELECT * FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE 'android_%'`);

      return formatObject<any>(tableFields).map((i) => {
        const createTableFields: string[] = i.sql
          .slice(i.sql.indexOf('(') + 1, i.sql.lastIndexOf(')'))
          .replace(/\t|\n/g, '')
          .split(',');

        return {
          name: i.name,
          fields: createTableFields
            .filter((field) => !field.toLowerCase().startsWith('foreign'))
            .map((item) => ({
              name: item.trim().split(' ')?.[0],
              type: item.trim().split(' ').slice(1).join(' '),
            })),
          foreignKeys: createTableFields.filter((field) =>
            field.toLowerCase().startsWith('foreign')
          ),
          values: [],
        };
      });
    } catch (err) {
      const message = getErrorText(err);
      this.setError(message);

      return null;
    }
  };

  insertValuesIntoSignature = async (
    signature: TableSignature
  ): Promise<TableSignature | null> => {
    try {
      let res = await this.executeSql(`SELECT * FROM ${signature.name}`);

      const tableValues: Record<string, any>[] =
        formatObject<Record<string, any>[]>(res);

      return _.cloneDeep({
        ...signature,
        values: tableValues.map((value) =>
          // сортирую поля tableValues в порядке, как у signature.fields
          signature.fields.reduce((acc, field) => {
            const key = field.name as keyof TableSignature;
            acc[key] = value[key];

            return acc;
          }, {} as TableSignature)
        ),
      });
    } catch (err) {
      const message = getErrorText(err);
      this.setError(message);

      return null;
    }
  };

  addRecord = async (
    tableName: string,
    model: TableSignatureValue
  ): Promise<[ResultSet] | undefined | null> => {
    try {
      return await this.DB?.executeSql(
        `INSERT INTO ${tableName} (${Object.keys(model).join(',')}) 
			VALUES (${Object.keys(model)
        .map(() => '?')
        .join(',')})`,
        Object.values(model)
      );
    } catch (err) {
      const message = getErrorText(err);
      this.setError(message);

      return null;
    }
  };

  editRecord = async (
    tableName: string,
    model: TableSignatureValue,
    initModel: Record<string, any>
  ): Promise<[ResultSet] | undefined | null> => {
    try {
      const where = Object.keys(initModel).reduce((acc, key, index) => {
        const value = initModel[key];

        if (
          !value ||
          (typeof value === 'string' && value.length > 255) ||
          typeof value === 'object'
        )
          return acc;

        return (
          acc +
          `${index !== 0 ? ' AND ' : ''}${key}=${typeof value === 'string' ? "'" + value + "'" : value}`
        );
      }, '');

      const dataToSet = Object.keys(model).reduce((acc, key, index, arr) => {
        const rawValue = model[key];

        const value = typeof rawValue === 'string' ? `'${rawValue}'` : rawValue;

        return (
          acc + ` ${key} = ${value} ` + (index + 1 === arr.length ? '' : ',')
        );
      }, '');

      return await this.DB?.executeSql(
        `UPDATE ${tableName} SET ${dataToSet} WHERE ${where}`
      );
    } catch (err) {
      const message = getErrorText(err);
      this.setError(message);

      return null;
    }
  };

  deleteRecord = async (
    tableName: string,
    signature: TableSignatureValue
  ): Promise<[ResultSet] | undefined | null> => {
    try {
      const where = Object.keys(signature).reduce((acc, key, index) => {
        const value = signature[key];

        // проблема с поиском по слишком длинным полям
        // убираем объекты, но в таком случае мало для матчинга и он может удалить несколько записей
        // TODO сделать удаление по PK, понять как его правильно выдергивать из имеющихся данных
        if (
          !value ||
          (typeof value === 'string' && value.length > 255) ||
          typeof value === 'object'
        ) {
          return acc;
        }

        return (
          acc +
          `${index !== 0 ? ' AND ' : ''}${key}=${typeof value === 'string' ? "'" + value + "'" : value}`
        );
      }, '');
      const record = await this.DB?.executeSql(
        `SELECT * FROM ${tableName} WHERE ${where}`
      );

      if (!record?.[0]?.rows?.length) {
        throw new Error(`Не удалось найти запись в таблице ${tableName}`);
      }

      return await this.DB?.executeSql(
        `DELETE FROM ${tableName} WHERE ${where}`
      );
    } catch (err) {
      const message = getErrorText(err);
      this.setError(message);

      return null;
    }
  };
}

export default new Database();

export function escape(
  str: string | null,
  limit: number | null = null
): string {
  if (typeof str !== 'string') {
    return '';
  }

  str = str.replace(/\n|\r/g, '').replace(/\s+/g, ' ').trim();

  if (!!limit && str.length > limit) {
    str = str.substr(0, limit);
  }

  return str;
}

export function formatObject<T>(sqlResults: Array<any> = []): Array<T> {
  const formatResults = [];

  for (let i0 = 0; i0 < sqlResults.length; i0++) {
    for (let i = 0; i < sqlResults[i0].rows.length; i++) {
      let row = sqlResults[i0].rows.item(i);

      //if (row.props) {
      //	row = JSON.parse(row.props);
      //}

      //if (row.data && !!row.data.trim()) {
      //	row.data = tryParse(row.data);
      //}

      //if (row.jsonInfo) {
      //	row.jsonInfo = JSON.parse(row.jsonInfo);
      //}

      formatResults.push(row);
    }
  }

  return formatResults;
}
