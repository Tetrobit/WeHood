import React from "react";
import {
  Scene,
  AmbientLight,
  OrthographicCamera,
} from "three";
import { loadObjAsync, Renderer, THREE } from "expo-three";
import { GLView } from "expo-gl";
import '.';
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSharedValue } from "react-native-reanimated";

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
      // three.js implementation.
      const scene = new Scene();
      const camera = new OrthographicCamera();

      camera.rotateX(-0.5);
      camera.position.y += 1;

      gl.canvas = {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
      };
  
      // set camera position away from cube
      camera.position.z = 2;
  
      const renderer = new Renderer({ gl });
      // set size of buffer to be equal to drawing buffer width
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      const ground = await loadObjAsync({
        asset: require('../assets/models/neighborhood.obj'),
        mtlAsset: require('../assets/models/neighborhood.mtl'),
      }).catch(err => console.error(err));

      const light = new THREE.HemisphereLight(0xffffff, 0x554411, 3);
      // const lightHelper = new THREE.HemisphereLightHelper(light);
      light.position.y = 50;
      light.rotateX(0.5);

      const groundWrapper = new THREE.Group();
      groundWrapper.add(ground);

      groundWrapper.scale.multiply(new THREE.Vector3(0.05, 0.05, 0.05));
      groundWrapper.rotateY(0.5);

      // add cube to scene
      scene.add(groundWrapper);
      scene.add(new AmbientLight(0xffffff, 1.0));
      scene.add(light);
      // scene.add(lightHelper);

      // create render function
      const render = () => {
        timeout_id = setTimeout(() => {
          request_id = requestAnimationFrame(render);
        }, 1000 / 20);

        let finalValue = 0.5 + offset.value / 100
        groundWrapper.rotation.y += (finalValue - groundWrapper.rotation.y) * 0.3;
        // groundWrapper.rotation.y

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };

      // call render
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
      <SafeAreaView>
        <GestureDetector gesture={pan}>
          <GLView
            onContextCreate={gl => setGl(gl)}
            style={{ width: 400, height: 400 }}
          />
        </GestureDetector>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
