import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { React, useCallback } from 'react';
import { useSharedValue, useAnimatedProps, withTiming, withDelay, Easing, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import Ticket from './Ticket.js';

const { width, height } = Dimensions.get('window');

const COLOR_PRIMARY1 = '#ff5569';// tomato
const COLOR_PRIMARY2 = '#41d5e4';// turquoise
const COLOR_PRIMARY3 = '#4f52e2';// royalblue
const COLOR_PRIMARY4 = '#ff8d37';// coral
const COLOR_BUTTON_PRIMARY = 'gray';

const R = 50;
const CIRCLE_LENGTH = 2 * Math.PI * R;
const STROKE_WIDTH = 20;
const REC_WIDTH = 150;
const REC_HEIGHT = 93;

const TIME_EXPAND_STROKE = 500;
const TIME_ROTATION = 2500;
const DELAY_ROTATION = 0;
const TIME_SHRINK_STROKE = 500;
const STROKE_LENGTH = 0.1;// 0 - 1

function getAnimationAngle(index)
{
  return Math.PI / 4 + index * Math.PI / 2;
}

export default function App() {
  const strokeLength = useSharedValue(0);
  const strokeRotation = useSharedValue(getAnimationAngle(0));
  const strokeRotateShrinkCorrection = useSharedValue(0);
  const recWidth = useSharedValue(STROKE_WIDTH);
  const recHeight = useSharedValue(STROKE_WIDTH);
  const rectangleIsAdded = useSharedValue(false);
  const circleIsRemoved = useSharedValue(false);
  const strokeWidth = useSharedValue(STROKE_WIDTH);
  const strokeTranslate = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH - 0.001 - CIRCLE_LENGTH * strokeLength.value,
    transform: [{translateX: width / 2}, {translateY: height / 2},
      {rotate: (strokeRotation.value + strokeRotateShrinkCorrection.value) },
      {translateX: -width / 2 + strokeTranslate.value}, {translateY: -height / 2 + strokeTranslate.value}],
    opacity: circleIsRemoved.value ? 0 : 1,
    strokeWidth: strokeWidth.value
  }));
  
  const getRecStyle = ANIMATION_ANGLE_RAD => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: R * Math.cos(ANIMATION_ANGLE_RAD) + (recWidth.value - STROKE_WIDTH) / 2,
          },
          {
            translateY: R * Math.sin(ANIMATION_ANGLE_RAD) + (recHeight.value - STROKE_WIDTH) / 2,
          },
        ],
        width: recWidth.value,
        height: recHeight.value,
        opacity: rectangleIsAdded.value ? 1 : 0,
      };
    });
  };

  function getRecStyles (animationIndex) {
    return getRecStyle(getAnimationAngle(animationIndex));
  }

  const onPress = useCallback(() => {
    
    strokeLength.value = 0;
    strokeRotation.value = getAnimationAngle(0);
    strokeRotateShrinkCorrection.value = 0;
    recWidth.value = STROKE_WIDTH;
    recHeight.value = STROKE_WIDTH;
    rectangleIsAdded.value = false;
    circleIsRemoved.value = false;
    strokeWidth.value = STROKE_WIDTH;
    strokeTranslate.value = 0;

    strokeLength.value = withTiming(STROKE_LENGTH, { duration: TIME_EXPAND_STROKE });
    strokeRotation.value = withDelay(DELAY_ROTATION, withTiming(getAnimationAngle(0) + (3 - STROKE_LENGTH) * 2 * Math.PI, { duration: TIME_ROTATION, easing: Easing.inOut(Easing.cubic) }));
    strokeLength.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(0.001, { duration: TIME_SHRINK_STROKE }));
    strokeRotateShrinkCorrection.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(STROKE_LENGTH * 2 * Math.PI, { duration: TIME_SHRINK_STROKE }));
    strokeWidth.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(0, { duration: TIME_SHRINK_STROKE }));
    strokeTranslate.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(STROKE_WIDTH, { duration: TIME_SHRINK_STROKE }));

    recWidth.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withSpring(REC_WIDTH, { damping: 15, mass: 1, stiffness: 100 }));
    recHeight.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withSpring(REC_HEIGHT, { damping: 15, mass: 1, stiffness: 100 }));
    //recWidth.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(REC_WIDTH, { duration: 500 }));
    //recHeight.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(REC_HEIGHT, { duration: 500 }));
    
    rectangleIsAdded.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(true, { duration: 0 }));
    circleIsRemoved.value = withDelay(TIME_ROTATION + DELAY_ROTATION, withTiming(true, { duration: 0 }));
  }, []);

  return (
    <View style={styles.container}>
      <Ticket animatedProps={animatedProps} recStyle={getRecStyles(0)} />
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>Run</Text>
      </TouchableOpacity>
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
  button: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.7,
    height: 60,
    backgroundColor: COLOR_BUTTON_PRIMARY,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 25,
    color: 'white',
    letterSpacing: 2.0,
  },
});