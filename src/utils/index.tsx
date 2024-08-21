import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-sqlite-explorer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export const Utils = NativeModules.SqliteExplorerUtils
  ? NativeModules.SqliteExplorerUtils
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function getDatabasePath(dbName: string): Promise<string> {
  return Utils.getDatabasePath(dbName);
}

export const tryParse = (data: any): object | null => {
  if (!!data && typeof data === 'object') return data;

  try {
    return JSON.parse(data);
  } catch (_: any) {
    return null;
  }
};

export const getErrorText = (err: any): string => {
  if (typeof err === 'string') {
    try {
      err = JSON.parse(err);
    } catch (error) {}
  }

  return (
    err?.data?.error ||
    err?.data?.message ||
    err?.message ||
    err?._response ||
    err?._response?.message ||
    JSON.stringify(err)
  );
};
