import React from "react";
import * as THREE from "three";
// import { color, fog, float, positionWorld, triNoise3D, positionView, normalWorld, uniform } from 'three/build/three.tsl';
import { loadObjAsync, Renderer } from "expo-three";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSharedValue } from "react-native-reanimated";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import Cloud from "@/components/cloud";
import { LinearGradient } from "expo-linear-gradient";

declare type NeighbourhoodProps = {
    width: number;
    height: number;
    onLoad?: Function;
};

const Neighbourhood = (props: NeighbourhoodProps) => {
  const [gl, setGl] = React.useState<ExpoWebGLRenderingContext|null>(null);

  const pressed = useSharedValue<boolean>(false);
  const offset = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
    })
    .onChange((event) => {
      offset.value = event.translationX;
    })
    .onFinalize(() => {
      pressed.value = false;
      offset.value = 0;
    });

  React.useLayoutEffect(() => {
    let request_id = 0;
    let timeout_id: any = 0;

    if (!gl) return () => {};

    (async () => {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, 1 - gl.drawingBufferHeight * 0.0017);

      camera.rotateX(-0.5);
      camera.position.y = 1.25;
      camera.position.z = 2;

      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      const ground = await loadObjAsync({
        asset: require('../assets/models/neighborhood.obj'),
        mtlAsset: require('../assets/models/neighborhood.mtl'),
      }).catch(err => console.error(err));

      const light = new THREE.DirectionalLight(0xffffff, 15);
      light.position.y = 4;
      light.position.z = 1;
      light.rotateX(0.75);

      light.castShadow = true

      const groundWrapper = new THREE.Group();
      groundWrapper.add(ground);
      groundWrapper.position.y = -5;

      groundWrapper.scale.multiply(new THREE.Vector3(0.05, 0.05, 0.05));
      groundWrapper.rotateY(0.5);

      scene.add(groundWrapper);
      scene.add(light);
      scene.add(camera);

      let groundShake = 0;
      let groundShakeTimeStart = 0;

      const render = (time: number) => {
        // timeout_id = setTimeout(() => {
          request_id = requestAnimationFrame(render);
        // }, 1000 / 20);

        let finalValue = 0.75 + 1 / (1 + Math.exp(-offset.value / 100)) - 0.5;
        groundWrapper.rotation.y += (finalValue - groundWrapper.rotation.y) * 0.05;
        if (!groundShake) {
          groundWrapper.position.y += -groundWrapper.position.y * 0.03;
          if (Math.abs(groundWrapper.position.y) < 0.05) {
            groundShake = 1;
            groundShakeTimeStart = time;
            if (props.onLoad) props.onLoad();
          }
        } else {
          groundWrapper.position.y += -Math.sin((time - groundShakeTimeStart) * 0.0015) * 0.001;
        }

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      request_id = requestAnimationFrame(render);
    })();

    return () => {
      if (request_id) {
        cancelAnimationFrame(request_id);
      }
      if (timeout_id) {
        clearTimeout(timeout_id);
      }
    }
  }, [gl]);

  return (
    
    <GestureHandlerRootView>
        <GestureDetector gesture={pan}>
            <GLView
                onContextCreate={gl => setGl(gl)}
                style={{ width: props.width, height: props.height, ...styles.canvas }}
            />
        </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    bottom: 0,
  },
})

export default Neighbourhood;
