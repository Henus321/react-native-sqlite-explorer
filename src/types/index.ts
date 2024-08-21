import { Location } from "react-native-sqlite-storage";

export type TableSignature = {
	name: string;
	fields: TableSignatureField[];
	values: TableSignatureValue[];
	foreignKeys: string[];
};

export type TableSignatureField = {
	name: string;
	type: string;
};

export type TableSignatureValue = Record<string, any>;

export type ModalType = 'add' | 'update' | null;

export type OneSelectValueType = {
	value: number | string;
	text?: string;
	subtext?: string;
};

export type DBParamsType = {
	name: string;
	location?: Location;
}