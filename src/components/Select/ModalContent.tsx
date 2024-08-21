import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { OneSelectValueType } from '../../types';

import Input from '../Input';
import { GlobalStyles } from '../../styles';

type ModalContentProps = {
  select: number | string | null;
  values: Array<OneSelectValueType>;
  onSelect: (val: OneSelectValueType) => void;
};

const ModalContent = ({
  values = [],
  select = null,
  onSelect = () => {},
}: ModalContentProps) => {
  const [filter, setFilter] = useState<string>('');

  const filteredValues = values.filter((i) =>
    !!filter.length
      ? (i?.text || `${i?.value}`)
          .toLowerCase()
          .indexOf(filter.toLowerCase()) !== -1
        ? true
        : false
      : true
  );

  return (
    <View>
      {values.length > 5 && (
        <Input
          placeholder="Search"
          onChangeText={(val) => setFilter(val)}
          onClearButtonPress={() => setFilter('')}
          text={filter}
          showClearButton={true}
          showMicrofone={true}
          title=""
        />
      )}

      {!filteredValues?.length && <Text>Empty...</Text>}

      <ScrollView style={{ marginTop: 10 }} keyboardShouldPersistTaps="handled">
        {filteredValues.map((i, k) => {
          if (!i?.value && !i?.text) {
            return null;
          }

          return (
            <TouchableOpacity
              style={styles.SelectItem}
              key={`k-${k}`}
              onPress={() => onSelect(i)}
            >
              <View>
                <Text
                  style={[
                    styles.SelectItemText,
                    select === i.value && styles.SelectItemTextSelected,
                  ]}
                >
                  {i?.text || i?.value}
                </Text>
                {!!i.subtext && <Text>{i.subtext}</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  SelectItem: {
    padding: 8,
    backgroundColor: GlobalStyles.colors.white,
    marginBottom: 10,
  },
  SelectItemText: {
    fontSize: 16,
  },
  SelectItemTextSelected: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default ModalContent;
