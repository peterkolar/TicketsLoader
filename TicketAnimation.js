import React, { forwardRef, useCallback, useImperativeHandle } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useSharedValue, useAnimatedProps, withTiming, withDelay, Easing, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import Ticket from './Ticket.js';

const { width, height } = Dimensions.get('window');

function getAnimationAngle(index)
{
  return Math.PI / 4 + index * Math.PI / 2;
}

const TicketAnimation = forwardRef((props, ref) => {
  const { R, STROKE_WIDTH, REC_WIDTH, REC_HEIGHT, TIME_EXPAND_STROKE, TIME_ROTATION, DELAY_ROTATION, TIME_SHRINK_STROKE, STROKE_LENGTH, TICKET_DAMPING, TICKET_MASS, TICKET_STIFFNESS, ROTATION_NUM_OF_CIRCLES, COLOR_PRIMARY1, COLOR_PRIMARY2, COLOR_PRIMARY3, COLOR_PRIMARY4 } = props;
  const CIRCLE_LENGTH = 2 * Math.PI * R;

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
            translateX: R * Math.cos(animAngle) + (recWidth.value - STROKE_WIDTH) / 2 * Math.sign(Math.cos(animAngle)) - (recWidth.value - STROKE_WIDTH) / 12 * Math.sign(Math.cos(animAngle)),
          },
          {
            translateY: R * Math.sin(animAngle) + (recHeight.value - STROKE_WIDTH) / 2 * Math.sign(Math.sin(animAngle)) - (recWidth.value - STROKE_WIDTH) / 12 * Math.sign(Math.sin(animAngle)),
          },
        ],
        width: recWidth.value,
        height: recHeight.value,
        opacity: rectangleIsAdded.value ? 1 : 0,
      };
    });
  };

  const reload = useCallback(() => {
    initAnimationSharedValues();

    strokeLength.value = withTiming(STROKE_LENGTH, { duration: TIME_EXPAND_STROKE });
    strokeRotation.value = withDelay(DELAY_ROTATION, withTiming(getAnimationAngle(0) + (ROTATION_NUM_OF_CIRCLES - STROKE_LENGTH) * 2 * Math.PI, { duration: TIME_ROTATION, easing: Easing.inOut(Easing.cubic) }));
    strokeLength.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(0.001, { duration: TIME_SHRINK_STROKE }));
    strokeRotateShrinkCorrection.value = withDelay(TIME_ROTATION + DELAY_ROTATION - TIME_SHRINK_STROKE, withTiming(STROKE_LENGTH * 2 * Math.PI, { duration: TIME_SHRINK_STROKE }));
    
    recWidth.value = withDelay(TIME_ROTATION + DELAY_ROTATION, withSpring(REC_WIDTH, { damping: TICKET_DAMPING, mass: TICKET_MASS, stiffness: TICKET_STIFFNESS }));
    recHeight.value = withDelay(TIME_ROTATION + DELAY_ROTATION, withSpring(REC_HEIGHT, { damping: TICKET_DAMPING, mass: TICKET_MASS, stiffness: TICKET_STIFFNESS }));

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

  useImperativeHandle(ref, () => ({
    start: reload
  }));

  return (
    <View style={styles.container}>
      <Ticket animatedProps={getAnimatedCircleProps(0)} recStyle={getRecStyle(0)} COLOR_PRIMARY={COLOR_PRIMARY1} R={R} STROKE_WIDTH={STROKE_WIDTH} />
      <Ticket animatedProps={getAnimatedCircleProps(1)} recStyle={getRecStyle(1)} COLOR_PRIMARY={COLOR_PRIMARY2} R={R} STROKE_WIDTH={STROKE_WIDTH} />
      <Ticket animatedProps={getAnimatedCircleProps(2)} recStyle={getRecStyle(2)} COLOR_PRIMARY={COLOR_PRIMARY3} R={R} STROKE_WIDTH={STROKE_WIDTH} />
      <Ticket animatedProps={getAnimatedCircleProps(3)} recStyle={getRecStyle(3)} COLOR_PRIMARY={COLOR_PRIMARY4} R={R} STROKE_WIDTH={STROKE_WIDTH} />
    </View>
  );
});

TicketAnimation.displayName = 'TicketAnimation';
TicketAnimation.defaultProps = {
  R: 40,
  STROKE_WIDTH: 15,
  REC_WIDTH: 150,
  REC_HEIGHT: 93,
  TIME_EXPAND_STROKE: 500,
  TIME_ROTATION: 2500,
  DELAY_ROTATION: 0,
  TIME_SHRINK_STROKE: 500,
  STROKE_LENGTH: 0.1,// 0 - 1
  TICKET_DAMPING: 12,
  TICKET_MASS: 1.2,
  TICKET_STIFFNESS: 100,
  ROTATION_NUM_OF_CIRCLES: 2,
  COLOR_PRIMARY1: 'tomato',
  COLOR_PRIMARY2: 'turquoise',
  COLOR_PRIMARY3: 'royalblue',
  COLOR_PRIMARY4: 'coral',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TicketAnimation;