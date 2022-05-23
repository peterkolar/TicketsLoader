
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const R = 50;
const CIRCLE_LENGTH = 2 * Math.PI * R;
const STROKE_WIDTH = 20;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Ticket(props) {  
  
  const styleSquareColor = StyleSheet.create({
    backgroundColor: props.COLOR_PRIMARY,
    position: 'absolute'
  });

  return (
    <>
      <Svg style={{ position: 'absolute' }}>
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={props.COLOR_PRIMARY}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={props.animatedProps}
          strokeLinecap={'round'}
        />
      </Svg>
      <Animated.View style={[styles.square, props.recStyle, styleSquareColor]} />
    </>
  );
}

  
  
const styles = StyleSheet.create({
  square: {
    width: STROKE_WIDTH,
    height: STROKE_WIDTH,
    borderRadius: STROKE_WIDTH / 2,
    opacity: 0,
  },
});