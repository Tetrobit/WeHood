import React from "react";
import * as THREE from "three";
// import { color, fog, float, positionWorld, triNoise3D, positionView, normalWorld, uniform } from 'three/build/three.tsl';
import { loadObjAsync, Renderer } from "expo-three";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
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
  const [gl, setGl] = React.useState<ExpoWebGLRenderingContext|null>(null);
  const [loading, setLoading] = React.useState(true);

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
      const camera = new THREE.OrthographicCamera();
      

      camera.rotateX(-0.5);
      camera.position.y = 1.0;
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
            setLoading(false);
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
          <View style={styles.header}>
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
            { loading && <ActivityIndicator size="large" color="#ffffff55" /> }
          </View>
          <GestureDetector gesture={pan}>
            <GLView
              onContextCreate={gl => setGl(gl)}
              style={{ ...styles.canvas }}
              />
          </GestureDetector> 
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

const blockWidth = 15;
const blockPad = 3;

const styles = StyleSheet.create({
  view: {
    height: '100%',
    paddingTop: 45
  },
  canvas: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 400
  },
  header: {
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 40,
    paddingRight: 20,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
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
    top: -31,
    left: 15
  },
  rightFiguresWrapper: {
    top: 8,
    left: 19,
  },
  rightFigure: {
    position: 'relative',
  },
  blockL1: {
    right: 0,
    top: 0
  },
  blockL2: {
    right: 0,
    top: blockPad + blockWidth,
  },
  blockL3: {
    right: blockPad + blockWidth,
    top: blockPad + blockWidth,
  },
  blockL4: {
    right: blockPad + blockWidth,
    top: (blockPad + blockWidth) * 2,
  },
  blockR1: {
    right: 0,
    top: 0
  },
  blockR2: {
    right: 0,
    top: blockPad + blockWidth,
  },
  blockR3: {
    right: blockPad + blockWidth,
    top: blockPad + blockWidth,
  },
  blockR4: {
    right: (blockPad + blockWidth) * 2,
    top: blockPad + blockWidth,
  },
  block: {
    position: 'absolute',
    width: blockWidth,
    height: blockWidth,
    backgroundColor: '#fffa',
    borderRadius: 3,
  },
  titleText: {
    color: 'white',
    fontSize: 20,
  }
})

export default App;
