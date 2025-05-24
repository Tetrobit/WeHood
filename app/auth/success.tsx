import Profile from "@/core/models/profile";
import { wait } from "@/core/utils/time";
import { useQuery } from "@realm/react";
import LottieView from "lottie-react-native";
import { useEffect, useLayoutEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";

export default function Success() {
  const [profile] = useQuery(Profile);
  const opacity = useSharedValue(0);
  const shift = useSharedValue(0);

  useLayoutEffect(() => {
    async function animation() {
      await wait(1200);
      opacity.value = 1;
      shift.value = -120;
    }

    animation();
  }, []);

  const config = {
    duration: 2500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, config),
  }));

  const shiftStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(shift.value, config) }],
  }));

  const styles = StyleSheet.create({
    container: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      transform: [{ translateY: -50 }],
    },
  });

  return (
    <>
      <Animated.View style={[shiftStyle]}>
        <LottieView style={{width: 300, height: 300}} source={require('@/assets/lottie/success.json')} autoPlay={true} loop={false} />
        <Animated.Text style={[opacityStyle, styles.container]}>Добро пожаловать{profile?.firstName ? ',' : '!'}</Animated.Text>
        <Animated.Text style={[opacityStyle, styles.container]}>{profile?.firstName} {profile?.lastName}</Animated.Text>
      </Animated.View>
    </>
  )
}