import {
  Text as NativeText,
  StyleProp,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { GlobalStyles } from '../../styles';

type TextProps = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

const Text = ({ children, style = {}, numberOfLines }: TextProps) => {
  return (
    <NativeText numberOfLines={numberOfLines} style={[styles.Text, style]}>
      {children}
    </NativeText>
  );
};

export const styles = StyleSheet.create({
  Text: {
    color: GlobalStyles.colors.text,
  },
});

export default Text;
