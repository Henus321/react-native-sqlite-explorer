import { useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	ModalType,
	OneSelectValueType,
	TableSignature,
	TableSignatureValue,
} from '../../types';
import { RECORDS_PER_PAGE_TYPES } from '../../Options';
import { GlobalStyles } from '../../styles';

import TableRow from './TableRow';
import TableActions from './TableActions';
import TableModal from './TableModal';
import Select from '../Select';
import DB from '../../models/DB';

type TableProps = {
	tableData: TableSignature;
	onActionSuccess: (tableData: TableSignature) => Promise<void>;
};

const Table = ({ tableData, onActionSuccess }: TableProps) => {
	const [modalType, setModalType] = useState<ModalType>(null);
	const [checkedRowIndex, setCheckedRowIndex] = useState<number | null>(null);
	const [page, setPage] = useState(1);
	const [recordsPerPage, setRecordsPerPage] = useState(
		RECORDS_PER_PAGE_TYPES[1]
	);
	const checkedRowValue =
		checkedRowIndex !== null ? tableData.values[checkedRowIndex] : null;
	const pagesCount = Math.ceil(tableData.values.length / recordsPerPage);
	const isFirstPage = page === 1;
	const isLastPage = pagesCount === page;

	useEffect(() => {
		if (!!DB.error) {
			Alert.alert('Error!', DB.error);
			DB.setError('');
		}
	}, [DB.error]);

	useEffect(() => {
		setCheckedRowIndex(null);
	}, [tableData]);

	const onDelete = async () => {
		if (!checkedRowValue) return;

		await DB.deleteRecord(tableData.name, checkedRowValue);
		setCheckedRowIndex(null);
		await onActionSuccess(tableData);
	};

	const onAdd = async (model: TableSignatureValue) => {
		await DB.addRecord(tableData.name, model);
	};

	const onUpdate = async (model: TableSignatureValue) => {
		if (!checkedRowValue) return;

		await DB.editRecord(tableData.name, model)
		//await DB.deleteRecord(tableData.name, checkedRowValue);
		//await DB.addRecord(tableData.name, model);
	};

	const onModalSubmit = async (model: TableSignatureValue) => {
		if (modalType === 'add') await onAdd(model);
		if (modalType === 'update') await onUpdate(model);

		await onActionSuccess(tableData);
		setModalType(null);
	};

	const onModalClose = () => setModalType(null);

	const openNextPage = () => {
		if (isLastPage) return;
		setPage(page + 1);
		setCheckedRowIndex(null);
	};

	const openPrevPage = () => {
		if (isFirstPage) return;
		setPage(page - 1);
		setCheckedRowIndex(null);
	};

	const onSelect = (val: OneSelectValueType) => {
		setRecordsPerPage(Number(val.value));
		setPage(1);
		setCheckedRowIndex(null);
	};

	const onTableRowPress = (index: number | null) => {
		setCheckedRowIndex((prev) => (prev === index ? null : index));
	};

	return (
		<>
			<TableModal
				checkedRowValue={checkedRowValue}
				tableData={tableData}
				modalType={modalType}
				onClose={onModalClose}
				onSubmit={onModalSubmit}
			/>

			<TableActions
				isRowChecked={!!checkedRowValue}
				onDelete={onDelete}
				setModalType={setModalType}
			/>

			<ScrollView horizontal>
				<View style={[styles.ScrollInnerContainer]}>
					<View style={styles.Row}>
						<View style={styles.CheckedCell}></View>

						{tableData.fields.map((field) => (
							<View
								key={`${field.name}_${field.type}`}
								style={[styles.RowCell, styles.RowHeadCell]}
							>
								<Text style={styles.BoldText} numberOfLines={1}>
									{field.name}
								</Text>
								<Text style={styles.BoldText} numberOfLines={1}>
									{field.type}
								</Text>
							</View>
						))}
					</View>

					<FlatList
						data={tableData.values.slice(
							(page - 1) * recordsPerPage,
							page * recordsPerPage
						)}
						renderItem={(props) => (
							<TableRow
								onPress={onTableRowPress}
								row={props.item}
								index={props.index}
								isChecked={checkedRowIndex === props.index}
							/>
						)}
						// TODO как тут быть с ключем? поля id может и не быть
						keyExtractor={(item, index) => `row-${item.id ? item.id : index}`}
						bounces={true}
						initialNumToRender={20}
						style={styles.TableContainer}
					/>
				</View>
			</ScrollView>

			<View style={styles.PagesContainer}>
				<TouchableOpacity
					onPress={openPrevPage}
					style={[styles.Page, isFirstPage && styles.PageDisabled]}
				>
					<Text>&#60;</Text>
				</TouchableOpacity>
				<View style={styles.ContainerSelect}>
					<Select
						placeholder=""
						modalTitle="Select page"
						title=""
						values={[...Array(pagesCount).keys()].map((key) => ({
							value: key + 1,
							text: (key + 1).toString(),
						}))}
						select={page}
						onSelect={(val) => setPage(Number(val.value))}
					/>
				</View>
				<View>
					<Text>/ {pagesCount}</Text>
				</View>
				<TouchableOpacity
					onPress={openNextPage}
					style={[styles.Page, isLastPage && styles.PageDisabled]}
				>
					<Text>&#62;</Text>
				</TouchableOpacity>
				<View style={styles.ContainerSelect}>
					<Select
						placeholder=""
						modalTitle="Select records per page"
						title=""
						values={RECORDS_PER_PAGE_TYPES.map((number) => ({
							value: number,
							text: number.toString(),
						}))}
						select={recordsPerPage}
						onSelect={onSelect}
					/>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	ScrollInnerContainer: {
		flex: 1,
		gap: 5,
		paddingHorizontal: 10,
	},
	TableContainer: {
		flex: 1,
		marginBottom: 10,
	},
	CheckedCell: {
		width: 6,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: GlobalStyles.colors.gray,
	},
	Row: {
		flexDirection: 'row',
		gap: 5,
	},
	RowCell: {
		width: 100,
		padding: 3,
		borderColor: GlobalStyles.colors.gray,
		borderWidth: 1,
	},
	RowHeadCell: {
		backgroundColor: 'lightblue',
	},
	BoldText: {
		textAlign: 'center',
		fontWeight: 'bold',
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
	PagesContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'white',
		gap: 10,
		padding: 8,
		borderTopWidth: 1,
		borderColor: GlobalStyles.colors.gray,
	},
	Page: {
		borderWidth: 1,
		width: 34,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 100,
		borderColor: GlobalStyles.colors.gray,
		backgroundColor: GlobalStyles.colors.white,
	},
	PageDisabled: {
		opacity: 0.25,
	},
	PageCurrent: {
		borderColor: GlobalStyles.colors.blue,
	},
	ContainerSelect: {
		width: 80,
	},
});

export default Table;
