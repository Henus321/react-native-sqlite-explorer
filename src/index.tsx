import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { DBParamsType, TableSignature } from './types';
import { GlobalStyles } from './styles';

import Table from './components/Table';
import Select from './components/Select';
import DB from './models/DB';

type SQLiteExplorerProps = {
  params: DBParamsType;
};

const SQLiteExplorer = ({ params }: SQLiteExplorerProps) => {
  const [signatures, setSignatures] = useState<TableSignature[]>([]);
  const [tableData, setTableData] = useState<TableSignature | null>(null);
  const [select, setSelect] = useState('');

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    const curSignature =
      signatures.find((signature) => signature.name === select) || null;

    if (!!curSignature) queryTableData(curSignature);
  }, [select]);

  const loadBase = async () => {
    try {
      await DB.open(params);
      setSignatures(
        ((await DB.getTablesSignature()) || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    } catch (error: any) {
      Alert.alert(
        'Внимание',
        'Не удалось открыть базу данных: ' + error.message
      );
    }
  };

  const queryTableData = async (signature: TableSignature) => {
    if (!signature) return;

    const signatureWithValues = await DB.insertValuesIntoSignature(signature);

    setTableData(signatureWithValues);
  };

  const onActionSuccess = async (tableData: TableSignature) => {
    await queryTableData(tableData);
  };

  return (
    <View style={styles.Container}>
      <View style={styles.ContainerInner}>
        <Select
          placeholder="Select"
          onSelect={(val) => setSelect(val.value.toString())}
          select={select}
          modalTitle="Table select"
          title="Table select"
          values={signatures.map((signature) => ({
            value: signature.name,
            text: signature.name,
          }))}
        />
      </View>

      {!!tableData && (
        <Table tableData={tableData} onActionSuccess={onActionSuccess} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    width: '100%',
    backgroundColor: GlobalStyles.colors.lightGray,
  },
  ContainerInner: {
    padding: 10,
  },
});

export default SQLiteExplorer;
