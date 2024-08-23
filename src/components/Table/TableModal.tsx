import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getInitialModel, isFieldRequired } from '../../Helpers';
import { ModalType, TableSignature, TableSignatureValue } from '../../types';
import { REQIRED_TEXT } from '../../Options';

import Input from '../Input';
import Modal from '../Modal';

type TableModalProps = {
  checkedRowValue: TableSignatureValue | null;
  tableData: TableSignature;
  modalType: ModalType;
  onClose: () => void;
  onSubmit: (
    model: TableSignatureValue,
    initialModel: TableSignatureValue
  ) => void;
};

const TableModal = ({
  checkedRowValue,
  tableData,
  modalType,
  onClose,
  onSubmit,
}: TableModalProps) => {
  const [model, setModel] = useState<TableSignatureValue>({});
  const [errors, setErrors] = useState<TableSignatureValue>({});
  const initialModel = getInitialModel(
    tableData.fields,
    modalType === 'update' ? checkedRowValue : null
  );

  useEffect(() => {
    setModel(initialModel);
    setErrors({});
  }, [modalType]);

  const getValidate = (model: TableSignatureValue): TableSignatureValue => {
    return tableData.fields.reduce((acc, field) => {
      if (isFieldRequired(field.type)) {
        Object.assign(acc, {
          [field.name]: !!model[field.name] ? '' : REQIRED_TEXT,
        });
      }

      return acc;
    }, {} as TableSignatureValue);
  };

  const onChange = (field: string, value: string) => {
    const newModel = { ...model, [field]: value };
    setModel(newModel);

    const _errors = getValidate(newModel);
    setErrors({
      ...errors,
      [field]: !!_errors[field] ? _errors[field] : '',
    });
  };

  const onSubmitHandler = () => {
    const _errors = getValidate(model);
    const errorLength = Object.values(_errors).filter((a) => !!a.length).length;
    setErrors(_errors);

    if (!!errorLength) return;

    onSubmit(model, initialModel);
  };

  return (
    <Modal
      visible={!!modalType}
      title={`${modalType === 'add' ? `Add new ${tableData.name} record` : `Update ${tableData.name} record`}`}
      onClose={onClose}
      onSubmit={onSubmitHandler}
    >
      <View>
        {tableData.fields.map((field) => {
          return (
            <Input
              title={`${isFieldRequired(field.type) ? '*' : ''}${field.name} (${field.type})`}
              key={`field-input-${field.name}`}
              text={model[field.name]}
              onChangeText={(value) => onChange(field.name, value)}
              style={{ marginBottom: 6 }}
              showMicrofone={false}
              placeholder={`${field.name}`}
              error={!!errors?.[field.name] ? errors[field.name] : false}
            />
          );
        })}
      </View>
    </Modal>
  );
};

export default TableModal;
