import { Animated, Easing, View } from 'react-native';

const Loader = () => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        backgroundColor: '#ffffff60',
        width: '100%',
        height: '100%',
        zIndex: 20,
      }}
    >
      <Animated.Image
        source={require('../../assets/reload.png')}
        style={{
          transform: [{ rotate: spin }],
          justifyContent: 'center',
          marginTop: 'auto',
          marginBottom: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 10,
        }}
      />
    </View>
  );
};

export default Loader;
