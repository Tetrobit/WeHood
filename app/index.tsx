import React from "react";
import * as THREE from "three";
// import { color, fog, float, positionWorld, triNoise3D, positionView, normalWorld, uniform } from 'three/build/three.tsl';
import { loadObjAsync, Renderer } from "expo-three";
import { GLView } from "expo-gl";
import '.';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSharedValue } from "react-native-reanimated";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Cloud from "@/components/cloud";
import { LinearGradient } from "expo-linear-gradient";

const App = () => {
  const [gl, setGl] = React.useState<any>(null);

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

    (async () => {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera();
      

      camera.rotateX(-0.5);
      camera.position.y = 1.0;

      gl.canvas = {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
      };
  
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
          groundWrapper.position.y += -groundWrapper.position.y * 0.01;
          if (Math.abs(groundWrapper.position.y) < 0.05) {
            groundShake = 1;
            groundShakeTimeStart = time;
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
      {/* <LinearGradient colors={['#f26f8b', '#fdc859']}> */}
      {/* <LinearGradient colors={['#393790', '#df729d']}> */}
      <LinearGradient colors={['#323f94', '#5ab8db']}>
      {/* <LinearGradient colors={['#df729d', '#393790']}> */}
      <SafeAreaView style={styles.view}>
          {/* <Cloud/> */}
          <View style={styles.titleContainer}>
            <View style={styles.leftFigure}>
              <View style={{...styles.figuresWrapper, ...styles.leftFiguresWrapper}}>
                <View style={styles.figuresWrapperRel}>
                  <View style={{...styles.block, ...styles.blockL1}} />
                  <View style={{...styles.block, ...styles.blockL2}} />
                  <View style={{...styles.block, ...styles.blockL3}} />
                  <View style={{...styles.block, ...styles.blockL4}} />
                </View>
              </View>
            </View>
            <Text style={styles.titleText}>Мой район</Text>
            <View style={styles.rightFigure}>
              <View style={{...styles.figuresWrapper, ...styles.rightFiguresWrapper}}>
                <View style={styles.figuresWrapperRel}>
                  <View style={{...styles.block, ...styles.blockR1}} />
                  <View style={{...styles.block, ...styles.blockR2}} />
                  <View style={{...styles.block, ...styles.blockR3}} />
                  <View style={{...styles.block, ...styles.blockR4}} />
                </View>
              </View>
            </View>
          </View>
          <GestureDetector gesture={pan}>
            <GLView
              onContextCreate={gl => setGl(gl)}
              style={{ width: '100%', height: 400, ...styles.canvas }}
              />
          </GestureDetector>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  view: {
    height: '100%',
    paddingTop: 200
  },
  canvas: {
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
    flexDirection: 'row',
  },
  titleWrapper: {

  },

  // Tetris Figures
  figuresWrapper: {
    position: 'absolute',
  },
  figuresWrapperRel: {
    position: 'relative',
  },
  leftFigure: {
    position: 'relative',
  },
  leftFiguresWrapper: {
    top: 5,
    left: 1
  },
  rightFiguresWrapper: {
    top: 10,
    left: 3,
  },
  rightFigure: {
    position: 'relative',
  },
  blockL1: {
    left: 0,
    top: -43
  },
  blockL2: {
    left: 0,
    top: -20,
  },
  blockL3: {
    left: -23,
    top: -20,
  },
  blockL4: {
    left: -23,
    top: 3,
  },
  // blockR1: {
  //   left: -23,
  //   top: -20,
  // },
  // blockR2: {
  //   left: 0,
  //   top: -20,
  // },
  // blockR3: {
  //   left: 0,
  //   top: 3,
  // },
  // blockR4: {
  //   left: 0,
  //   top: 26,
  // },
  blockR1: {
    left: 0,
    top: 3,
  },
  blockR2: {
    left: 0,
    top: 26,
  },
  blockR3: {
    right: 3,
    top: 26,
  },
  blockR4: {
    right: 26,
    top: 26,
  },
  block: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#fffa',
    borderRadius: 3,
  },
  titleText: {
    color: 'white',
    fontSize: 30,
  }
})

export default App;
