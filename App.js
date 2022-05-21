import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { React, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const COLOR_PRIMARY1 = '#ff5569';// tomato
const COLOR_PRIMARY2 = '#41d5e4';// turquoise
const COLOR_PRIMARY3 = '#4f52e2';// royalblue
const COLOR_PRIMARY4 = '#ff8d37';// coral

const R = 50;
const CIRCLE_LENGTH = 2 * Math.PI * R;
const STROKE_WIDTH = 20;

const TIME_EXPAND_STROKE = 500;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function App() {
  const strokeLength = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH - 0.001 - CIRCLE_LENGTH * strokeLength.value,
  }));

  useEffect(() => {
    strokeLength.value = withTiming(0.1, { duration: TIME_EXPAND_STROKE });
  }, []);
  
  return (
    <View style={styles.container}>
      <Svg style={{ position: 'absolute' }}>
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={COLOR_PRIMARY1}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap={'round'}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
