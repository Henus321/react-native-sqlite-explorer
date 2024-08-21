import { Button, Image, ImageStyle, Modal as NaviteModal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { GlobalStyles } from '../../styles';

type ModalProps = {
	children: React.ReactNode;
	title: string;
	visible: boolean;
	onClose: () => void;
	onSubmit?: () => void;
}

const Modal = ({ children, title, visible, onClose, onSubmit }: ModalProps) => {
	return (
		<NaviteModal
			animationType='slide'
			visible={!!visible}
			onRequestClose={onClose}
		>
			<View style={styles.Wrapper}>
				<View style={styles.ContentHead}>
					<View style={styles.ContentHeadTextContainer}>
						<Text style={styles.ContentHeadText}>
							{title}
						</Text>
					</View>
					<TouchableOpacity onPress={onClose}>
						<Image
							style={[styles.ContentHeadImage] as ImageStyle}
							source={require('../../assets/close.png')}
						/>
					</TouchableOpacity>
				</View>

				<ScrollView keyboardShouldPersistTaps={'handled'}>
					<View style={styles.ContentInnerContainer}>


						<View>
							{children}
						</View>
					</View>
				</ScrollView>

				{!!onSubmit &&
					<Button title="Submit" onPress={onSubmit} color={GlobalStyles.colors.blue} />
				}
			</View>
		</NaviteModal>
	)
};

const styles = StyleSheet.create({
	Wrapper: {
		flex: 1,
		backgroundColor: GlobalStyles.colors.lightGray,
	},
	ContentInnerContainer: {
		padding: 10
	},
	ContentHead: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 10,
		borderBottomWidth: 2,
		borderColor: GlobalStyles.colors.gray,
	},
	ContentHeadTextContainer: {
		flexDirection: 'row',
	},
	ContentHeadText: {
		flexWrap: 'wrap',
		fontSize: 20
	},
	ContentHeadImage: {
		tintColor: GlobalStyles.colors.darkGray,
	},
});

export default Modal;