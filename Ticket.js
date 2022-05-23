
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const COLOR_PRIMARY = '#ff5569';// tomato
  
const R = 50;
const CIRCLE_LENGTH = 2 * Math.PI * R;
const STROKE_WIDTH = 20;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function Ticket(props) {  
  return (
    <>
      <Svg style={{ position: 'absolute' }}>
        <AnimatedCircle
          cx={width / 2}
          cy={height / 2}
          r={R}
          stroke={COLOR_PRIMARY}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={props.animatedProps}
          strokeLinecap={'round'}
        />
      </Svg>
      <Animated.View style={[styles.square, props.recStyle]} />
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: STROKE_WIDTH,
    height: STROKE_WIDTH,
    backgroundColor: COLOR_PRIMARY,
    borderRadius: STROKE_WIDTH / 2,
    opacity: 0,
    left: R,
    top: 0,
  },
});
