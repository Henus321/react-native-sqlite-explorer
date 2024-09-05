import { useState } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ImageStyle,
} from 'react-native';
import { GlobalStyles } from '../../styles';
import { OneSelectValueType } from '../../types';

import ModalContent from './ModalContent';
import Modal from '../Modal';
import Text from '../Text';

type SelectProps = {
  placeholder?: string;
  values: Array<OneSelectValueType>;
  onSelect: (val: OneSelectValueType) => void;
  select: number | string;
  title: string;
  modalTitle: string;
  error?: boolean | string;
};

export default function Select({
  placeholder = '',
  values = [],
  onSelect = () => {},
  select = '',
  title = '',
  modalTitle = '',
}: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const onModalOpen = () => {
    setModalVisible(true);
  };

  const onModalClose = () => {
    setModalVisible(false);
  };

  const onHandleSelect = (val: OneSelectValueType) => {
    onSelect(val);
    onModalClose();
  };

  const selectItem = values.filter((a) => a.value === select);

  return (
    <View>
      <Modal
        visible={modalVisible}
        title={modalTitle}
        onClose={() => setModalVisible(false)}
      >
        <ModalContent
          values={values}
          onSelect={onHandleSelect}
          select={select}
        />
      </Modal>

      {!!title && <Text style={styles.SelectTitle}>{title}</Text>}

      <TouchableOpacity style={styles.Select} onPress={onModalOpen}>
        <Text style={styles.SelectText} numberOfLines={1}>
          {selectItem?.[0]?.text ?? selectItem?.[0]?.value ?? placeholder}
        </Text>

        <Image
          style={[styles.SelectArrow] as ImageStyle}
          source={require('../../assets/arrow.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  ModalContent: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  ModalClose: {
    borderRadius: 20,
    padding: 10,
    color: GlobalStyles.colors.textGrey,
  },
  ModalCloseText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: GlobalStyles.colors.textGrey,
  },
  SelectTitle: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: GlobalStyles.colors.textGrey,
  },
  Select: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: GlobalStyles.colors.gray,
    borderWidth: 1,
    backgroundColor: GlobalStyles.colors.white,
    padding: 10,
  },
  SelectText: {
    fontSize: 14,
    color: GlobalStyles.colors.textGrey,
  },
  SelectArrow: {
    width: 10,
    height: 10,
    tintColor: GlobalStyles.colors.darkGray,
    transform: [{ rotate: '180deg' }],
  },
});
