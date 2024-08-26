import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

const AnimateState = {
  start: 0,
  end: 360,
};

const Loader = () => {
  const value = useRef(new Animated.Value(AnimateState.start)).current;
  const inputRange = [AnimateState.start, AnimateState.end];
  const rotate = value.interpolate({
    inputRange,
    outputRange: [0 + 'deg', 360 + 'deg'],
  });

  useEffect(() => {
    startAnimate();

    return () => {
      stopAnimate();
    };
  }, []);

  const startAnimate = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: AnimateState.end,
          useNativeDriver: false,
          duration: 1000,
          easing: Easing.linear,
        }),
      ])
    ).start();
  };

  const stopAnimate = () => value.stopAnimation();

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
          transform: [{ rotate }],
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
