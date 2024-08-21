import { Button, StyleSheet, View } from "react-native"
import { ModalType } from "../../types";
import { GlobalStyles } from "../../styles";

type TableActionsProps = {
	isRowChecked: boolean;
	setModalType: (modalType: ModalType) => void;
	onDelete: () => Promise<void>;
};

const TableActions = ({ isRowChecked, setModalType, onDelete }: TableActionsProps) => {
	return (
		<View style={styles.Container}>
			<View style={styles.ContainerInner}>
				<Button color={GlobalStyles.colors.blue} title="Add" onPress={() => setModalType('add')} />
				<Button color={GlobalStyles.colors.blue} title="Update" disabled={!isRowChecked} onPress={() => setModalType('update')} />
				<Button color={GlobalStyles.colors.blue} title="Delete" disabled={!isRowChecked} onPress={onDelete} />
			</View>
		</View>
	)
};

const styles = StyleSheet.create({
	Container: {
		gap: 5,
		paddingHorizontal: 10,
		marginBottom: 5,
	},
	ContainerInner: {
		flexDirection: 'row',
		gap: 5,
		marginBottom: 5
	},
	Text: {
		textAlign: 'center'
	},
	Arrow: {
		resizeMode: 'contain',
		width: 10,
		height: 10,
		marginHorizontal: 7
	},
	ArrowReverse: {
		transform: [{ rotate: '180deg' }],
	}
});

export default TableActions;