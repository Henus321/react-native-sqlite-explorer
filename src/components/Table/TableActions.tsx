import { Button, StyleSheet, View } from 'react-native';
import { ModalType, SearchType } from '../../types';
import { GlobalStyles } from '../../styles';
import { useState } from 'react';
import Input from '../Input';

type TableActionsProps = {
  isRowChecked: boolean;
  setModalType: (modalType: ModalType) => void;
  onDelete: () => Promise<void>;
  onSearchSubmit: (search: SearchType) => void;
};

const TableActions = ({
  isRowChecked,
  setModalType,
  onDelete,
  onSearchSubmit,
}: TableActionsProps) => {
  const [search, setSearch] = useState<SearchType>({ key: '', value: '' });

  const handleSearchSubmit = () => {
    onSearchSubmit(search);
  };

  return (
    <View style={styles.Container}>
      <View style={styles.ContainerInner}>
        <Button
          color={GlobalStyles.colors.blue}
          title="Add"
          onPress={() => setModalType('add')}
        />
        <Button
          color={GlobalStyles.colors.blue}
          title="Update"
          disabled={!isRowChecked}
          onPress={() => setModalType('update')}
        />
        <Button
          color={GlobalStyles.colors.blue}
          title="Delete"
          disabled={!isRowChecked}
          onPress={onDelete}
        />
      </View>
      <View style={styles.ContainerInner}>
        <Input
          style={{ flex: 1, height: 36 }}
          placeholder="key"
          text={search.key}
          onChangeText={(text) => setSearch((prev) => ({ ...prev, key: text }))}
        />
        <Input
          style={{ flex: 1, height: 36 }}
          placeholder="value"
          text={search.value}
          onChangeText={(text) =>
            setSearch((prev) => ({ ...prev, value: text }))
          }
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            color={GlobalStyles.colors.blue}
            title="Search"
            onPress={handleSearchSubmit}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    gap: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  ContainerInner: {
    flexDirection: 'row',
    gap: 5,
  },
  Text: {
    textAlign: 'center',
  },
  Arrow: {
    resizeMode: 'contain',
    width: 10,
    height: 10,
    marginHorizontal: 7,
  },
  ArrowReverse: {
    transform: [{ rotate: '180deg' }],
  },
});

export default TableActions;
