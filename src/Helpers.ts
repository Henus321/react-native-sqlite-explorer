import { TableSignature, TableSignatureValue } from "./types";

export const getInitialModel = (fields: TableSignature['fields'], prefillValue: TableSignatureValue | null) => {
	return fields.reduce((acc, field) => {
		Object.assign(acc, {
			[field.name]: !!prefillValue ? (prefillValue?.[field.name] || '') : '',
		})

		return acc;
	}, {} as Record<string, string>)
};

export const isFieldRequired = (fieldType: string) => {
	const fixedType = fieldType.toLowerCase();
	return (fixedType.indexOf('primary key') !== -1 || fixedType.indexOf('not null') !== -1);
};