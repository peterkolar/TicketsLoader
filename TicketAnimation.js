import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSharedValue, useAnimatedProps, withTiming, withDelay, Easing, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import Ticket from './Ticket.js';

const { width, height } = Dimensions.get('window');
const COLOR_PRIMARY1 = 'tomato';
const COLOR_PRIMARY2 = 'turquoise';
const COLOR_PRIMARY3 = 'royalblue';
const COLOR_PRIMARY4 = 'coral';

const R = 40;
const CIRCLE_LENGTH = 2 * Math.PI * R;
const STROKE_WIDTH = 15;
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

export default function TicketAnimation(props) {

  const generate = () => onReload();
  
  useEffect(() => {
    props.generateRef.current = generate;

    return () => {
      props.generateRef.current = null;
    };
  }, []);

  const strokeLength = useSharedValue(0);
  const strokeRotation = useSharedValue(getAnimationAngle(0));
  const strokeRotateShrinkCorrection = useSharedValue(0);
  const recWidth = useSharedValue(STROKE_WIDTH);
  const recHeight = useSharedValue(STROKE_WIDTH);
  const rectangleIsAdded = useSharedValue(false);
  const circleIsRemoved = useSharedValue(true);
  const strokeWidth = useSharedValue(STROKE_WIDTH);
  const strokeTranslate = useSharedValue(0);

  const getAnimatedCircleProps = animationIndex => {
    return useAnimatedProps(() => ({
      strokeDashoffset: CIRCLE_LENGTH - 0.001 - CIRCLE_LENGTH * strokeLength.value,
      transform: [{translateX: width / 2}, {translateY: height / 2},
        {rotate: (strokeRotation.value + Math.PI / 2 * animationIndex + strokeRotateShrinkCorrection.value) },
        {translateX: -width / 2 + strokeTranslate.value}, {translateY: -height / 2 + strokeTranslate.value}],
      opacity: circleIsRemoved.value ? 0 : 1,
      strokeWidth: strokeWidth.value
    }));
  };
  
  const getRecStyle = (animationIndex) => {
    const animAngle = getAnimationAngle(animationIndex);
    return useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: R * Math.cos(animAngle) + (recWidth.value - STROKE_WIDTH) / 2 * Math.sign(Math.cos(animAngle)) - (recWidth.value - STROKE_WIDTH) / 8 * Math.sign(Math.cos(animAngle)),
          },
          {
            translateY: R * Math.sin(animAngle) + (recHeight.value - STROKE_WIDTH) / 2 * Math.sign(Math.sin(animAngle)) - (recWidth.value - STROKE_WIDTH) / 8 * Math.sign(Math.sin(animAngle)),
          },
        ],
        width: recWidth.value,
        height: recHeight.value,
        opacity: rectangleIsAdded.value ? 1 : 0,
      };
    });
  };

  const onReload = useCallback(() => {
    initAnimationSharedValues();

    strokeLength.value = withTiming(STROKE_LENGTH, { duration: TIME_EXPAND_STROKE });
    strokeRotation.value = withDelay(DELAY_ROTATION, withTiming(getAnimationAngle(0) + (2 - STROKE_LENGTH) * 2 * Math.PI, { duration: TIME_ROTATION, easing: Easing.inOut(Easing.cubic) }));
    strokeLength.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(0.001, { duration: TIME_SHRINK_STROKE }));
    strokeRotateShrinkCorrection.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(STROKE_LENGTH * 2 * Math.PI, { duration: TIME_SHRINK_STROKE }));
    
    recWidth.value = withDelay(TIME_ROTATION + DELAY_ROTATION, withSpring(REC_WIDTH, { damping: 12, mass: 1.2, stiffness: 100 }));
    recHeight.value = withDelay(TIME_ROTATION + DELAY_ROTATION, withSpring(REC_HEIGHT, { damping: 12, mass: 1.2, stiffness: 100 }));

    rectangleIsAdded.value = withDelay(TIME_ROTATION + DELAY_ROTATION, withTiming(true, { duration: 0 }));
    circleIsRemoved.value = withDelay(TIME_ROTATION + DELAY_ROTATION, withTiming(true, { duration: 0 }));
  }, []);

  function initAnimationSharedValues(){
    strokeLength.value = 0;
    strokeRotation.value = getAnimationAngle(0);
    strokeRotateShrinkCorrection.value = 0;
    recWidth.value = STROKE_WIDTH;
    recHeight.value = STROKE_WIDTH;
    rectangleIsAdded.value = false;
    circleIsRemoved.value = false;
    strokeWidth.value = STROKE_WIDTH;
    strokeTranslate.value = 0;
  }

  return (
    <View style={styles.container}>
      <Ticket animatedProps={getAnimatedCircleProps(0)} recStyle={getRecStyle(0)} COLOR_PRIMARY={COLOR_PRIMARY1} R={R} STROKE_WIDTH={STROKE_WIDTH} />
      <Ticket animatedProps={getAnimatedCircleProps(1)} recStyle={getRecStyle(1)} COLOR_PRIMARY={COLOR_PRIMARY2} R={R} STROKE_WIDTH={STROKE_WIDTH} />
      <Ticket animatedProps={getAnimatedCircleProps(2)} recStyle={getRecStyle(2)} COLOR_PRIMARY={COLOR_PRIMARY3} R={R} STROKE_WIDTH={STROKE_WIDTH} />
      <Ticket animatedProps={getAnimatedCircleProps(3)} recStyle={getRecStyle(3)} COLOR_PRIMARY={COLOR_PRIMARY4} R={R} STROKE_WIDTH={STROKE_WIDTH} />
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