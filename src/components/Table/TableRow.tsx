import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TableSignatureValue } from '../../types';
import { GlobalStyles } from '../../styles';

type TableRowProps = {
  row: TableSignatureValue;
  index: number;
  isChecked: boolean;
  onPress: (index: number | null) => void;
};

const TableRow = ({ row, index, isChecked, onPress }: TableRowProps) => {
  return (
    <TouchableOpacity onPress={() => onPress(index)} style={styles.Row}>
      <View
        style={[styles.CheckedCell, isChecked && styles.CheckedCellActive]}
      ></View>

      {Object.values(row).map((value, valueIndex) => (
        <View
          key={`row-${index}-value-${valueIndex}`}
          style={[styles.RowCell, isChecked && styles.RowCellActive]}
        >
          <Text style={styles.Text} numberOfLines={4}>
            {value}
          </Text>
        </View>
      ))}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  CheckedCell: {
    width: 6,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray,
  },
  CheckedCellActive: {
    backgroundColor: GlobalStyles.colors.blue,
  },
  Row: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 5,
  },
  RowCell: {
    width: 100,
    padding: 3,
    borderColor: GlobalStyles.colors.gray,
    borderWidth: 1,
  },
  RowCellActive: {
    backgroundColor: GlobalStyles.colors.white,
  },
  Text: {
    textAlign: 'center',
  },
});

export default TableRow;
