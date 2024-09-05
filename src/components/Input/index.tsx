import { RefObject, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  KeyboardTypeOptions,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { GlobalStyles } from '../../styles';
import Text from '../Text';

type InputProps = {
  placeholder?: string;
  placeholderColor?: string | null;
  placeholderStyle?: TextStyle | TextStyle[];
  onChangeText: ((text: string) => void) | undefined;
  onSubmitEditing?:
    | ((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void)
    | undefined;
  onClearButtonPress?: null | (() => void);
  onBlur?: null | (() => void);
  text: string | number;
  style?: ViewStyle | ViewStyle[];
  inputStyle?: ViewStyle | ViewStyle[];
  showClearButton?: boolean;
  showMicrofone?: boolean;
  title?: string;
  maxLength?: number | undefined;
  multiline?: boolean | undefined;
  numberOfLines?: number;
  error?: boolean | string;
  autoCompleteType?: null | string;
  textContentType?: any;
  keyboardType?: KeyboardTypeOptions | undefined;
  secureTextEntry?: boolean;
  refInput?: RefObject<TextInput> | null;
  readOnly?: false | (() => void);
};

const Input = ({
  placeholder = '',
  placeholderColor = null,
  placeholderStyle = {},
  onChangeText = () => {},
  onSubmitEditing = () => {},
  onClearButtonPress = null,
  onBlur = () => {},
  text = '',
  style = {},
  inputStyle = {},
  showClearButton = true,
  title = '',
  maxLength = undefined,
  multiline = false,
  numberOfLines = 1,
  error = false,
  autoCompleteType = null,
  textContentType = null,
  keyboardType = undefined,
  refInput = null,
  secureTextEntry = false,
  readOnly = false,
}: InputProps) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={{ ...style }}>
      {!!title && <Text style={styles.Title}>{title}</Text>}

      <View
        style={[
          styles.InputWrapper,
          { ...inputStyle },
          !!isFocus && styles.FocusInput,
          !!error && styles.ErrorInput,
        ]}
      >
        <TextInput
          ref={refInput}
          value={`${text}`}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          style={[styles.Input, placeholderStyle]}
          placeholder={placeholder}
          placeholderTextColor={
            !!placeholderColor ? placeholderColor : styles.Placeholder.color
          }
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!readOnly ? true : false}
          // @ts-ignore
          autoCompleteType={autoCompleteType}
          textContentType={textContentType}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocus(true)}
          onBlur={() => {
            setIsFocus(false);
            if (onBlur !== null) {
              onBlur();
            }
          }}
        />

        <View style={styles.RightContainer}>
          {!!`${text}`.length && !!showClearButton && (
            <TouchableOpacity
              style={styles.IconWrapper}
              onPress={() => {
                if (onClearButtonPress !== null) {
                  onClearButtonPress();
                } else {
                  onChangeText('');
                }
              }}
            >
              <Image
                source={require('../../assets/close.png')}
                style={styles.Icon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {!!error && typeof error === 'string' && error?.trim() && (
        <Text style={styles.ErrorText}>{error.trim()}</Text>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  Title: {
    fontSize: 12,
    color: GlobalStyles.colors.textGrey,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  InputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: GlobalStyles.colors.gray,
    backgroundColor: GlobalStyles.colors.white,
  },
  Input: {
    flex: 1,
    fontSize: 14,
    color: GlobalStyles.colors.text,
    paddingVertical: 7,
    paddingHorizontal: 9,
    backgroundColor: 'transparent',
  },
  Placeholder: {
    color: GlobalStyles.colors.gray,
  },
  FocusInput: {
    borderColor: GlobalStyles.colors.blue,
  },
  ErrorInput: {
    borderColor: GlobalStyles.colors.red,
  },
  ErrorText: {
    fontSize: 12,
    marginTop: 2,
    color: GlobalStyles.colors.red,
  },
  RightContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconWrapper: {
    padding: 9,
  },
  Icon: {
    width: 10,
    height: 10,
    tintColor: GlobalStyles.colors.text,
    resizeMode: 'contain',
  },
  BiggerIcon: {
    width: 14,
    height: 14,
  },
});

export default Input;
