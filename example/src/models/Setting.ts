import DB from './DB';

class Setting {
  init: () => Promise<void> = () => {
    return new Promise<void>(async (resolve): Promise<void> => {
      DB.isTableExist('Setting').then((ifExists): void => {
        if (ifExists) {
          resolve();
        } else {
          DB.transaction(async (): Promise<void> => {
            await DB.executeSql(`
								CREATE TABLE IF NOT EXISTS Setting (
									_id INTEGER PRIMARY KEY AUTOINCREMENT,
									name VARCHAR(255)
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
      await DB.executeSql('DROP TABLE IF EXISTS Setting');
      await this.init();
      resolve();
    });
  };
}

export default new Setting();
