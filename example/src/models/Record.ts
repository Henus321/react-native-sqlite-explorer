import DB from './DB';

class Record {
  init: () => Promise<void> = () => {
    return new Promise<void>(async (resolve): Promise<void> => {
      DB.isTableExist('Record').then((ifExists): void => {
        if (ifExists) {
          resolve();
        } else {
          DB.transaction(async (): Promise<void> => {
            await DB.executeSql(`
								CREATE TABLE IF NOT EXISTS Record (
									_id INTEGER PRIMARY KEY AUTOINCREMENT,
									name VARCHAR(255),
									description VARCHAR(255),
									type VARCHAR(100),
									code INTEGER,
									json TEXT NOT NULL
								)
							`);
            resolve();
          });
        }
      });
    });
  };

  truncate: () => Promise<void> = () => {
    return new Promise(async (resolve): Promise<void> => {
      await DB.executeSql('DROP TABLE IF EXISTS Record');
      await this.init();
      resolve();
    });
  };
}

export default new Record();
