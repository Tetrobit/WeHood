import React from "react";
import * as THREE from "three";
import { loadObjAsync, Renderer } from "expo-three";
import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSharedValue } from "react-native-reanimated";

declare type NeighbourhoodProps = {
    width: number;
    height: number;
    onLoad?: Function;
    styles?: any;
};


const CAR_INITIAL_STATE = [
  {
    position: new THREE.Vector3(0, 0, 9),
    rotation: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0.006),
  },
  {
    position: new THREE.Vector3(0, 0, -8),
    rotation: new THREE.Vector3(0, Math.PI, 0),
    velocity: new THREE.Vector3(0, 0, -0.006),
  },
  {
    position: new THREE.Vector3(-9, 0, 0),
    rotation: new THREE.Vector3(0, -Math.PI / 2, 0),
    velocity: new THREE.Vector3(-0.006, 0, 0),
  },
  {
    position: new THREE.Vector3(8.5, 0, 0),
    rotation: new THREE.Vector3(0, Math.PI / 2, 0),
    velocity: new THREE.Vector3(0.006, 0, 0),
  },
];

const MAX_DISTANCE = 24;

const CAR_COLORS = [
  { color: new THREE.Color(0xfb8500) },
  { color: new THREE.Color(0xffb703) },
  { color: new THREE.Color(0x219ebc) },
  { color: new THREE.Color(0xfdf0d5) },
  { color: new THREE.Color(0xc1121f) },
  { color: new THREE.Color(0x2a9d8f) },
  { color: new THREE.Color(0xbde0fe) },
  { color: new THREE.Color(0xc9ada7) },
  { color: new THREE.Color(0x90a955) },
  { color: new THREE.Color(0xfcf6bd) },
  { color: new THREE.Color(0xd0f4de) },
  { color: new THREE.Color(0xe4c1f9) },
  { color: new THREE.Color(0x0466c8) },
  { color: new THREE.Color(0x0353a4) },
  { color: new THREE.Color(0x7d8597) },
  { color: new THREE.Color(0xe07a5f) },
  { color: new THREE.Color(0x8d99ae) },
  { color: new THREE.Color(0x40916c) },
  { color: new THREE.Color(0x598392) },
];


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

      // Perspective camera 
      const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
      camera.position.y = 0.5;
      camera.position.z = 2;

      // Orthographic camera
      // const camera = new THREE.OrthographicCamera(-1, 1, 1, 1 - gl.drawingBufferHeight * 0.0017);
      // camera.position.y = 1.25;
      // camera.position.z = 2;

      camera.rotateX(-0.5);

      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      const ground = await loadObjAsync({
        asset: require('@/assets/models/neighborhood_ground_object.obj'),
        mtlAsset: require('@/assets/models/neighborhood_ground_material.mtl'),
      }).catch(err => console.error(err));
      
      const carObj = await loadObjAsync({
        asset: require('@/assets/models/neighborhood_car_object.obj'),
        mtlAsset: require('@/assets/models/neighborhood_car_material.mtl'),
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

      const carSpawnBaseTimeout = 350;
      const carSpawnMaxTimeout = 1500;

      class Car {
        public carObj: THREE.Object3D;
        public velocity: THREE.Vector3;
        public distance: number;
        constructor(carObj: THREE.Object3D) {
          this.carObj = carObj.clone();
          this.carObj.position.z = 9;
          this.distance = 0;
          const carMesh = this.carObj.children[0] as THREE.Mesh;
          const materials = carMesh.material as THREE.MeshStandardMaterial[];
          materials[0] = materials[0].clone();
          materials[0].color.set(CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)].color);
          carMesh.material = materials;

          cars.push(this);
          groundWrapper.add(this.carObj);

          const state = CAR_INITIAL_STATE[Math.floor(Math.random() * CAR_INITIAL_STATE.length)];
          this.carObj.position.x = state.position.x;
          this.carObj.position.y = state.position.y;
          this.carObj.position.z = state.position.z;
          this.carObj.rotation.x = state.rotation.x;
          this.carObj.rotation.y = state.rotation.y;
          this.carObj.rotation.z = state.rotation.z;
          this.velocity = state.velocity;
        }

        update(deltaTime: number) {
          this.carObj.position.x -= this.velocity.x * deltaTime;
          this.carObj.position.y -= this.velocity.y * deltaTime;
          this.carObj.position.z -= this.velocity.z * deltaTime;

          this.distance += Math.abs(this.velocity.x * deltaTime);
          this.distance += Math.abs(this.velocity.y * deltaTime);
          this.distance += Math.abs(this.velocity.z * deltaTime);

          if (this.distance > MAX_DISTANCE) {
            this.destroy();
          }
        }

        destroy() {
          groundWrapper.remove(this.carObj);
          cars.splice(cars.indexOf(this), 1);
        }
      }

      let cars: any[] = [];

      let lastTime: number = 0;
      let lastCarSpawnTime: number = 0;

      const render = (time: number) => {
        if (lastTime === 0) {
          lastTime = time;
        }

        const deltaTime = time - lastTime;
        lastTime = time;

        // timeout_id = setTimeout(() => {
          request_id = requestAnimationFrame(render);
        // }, 1000 / 20);

        let finalValue = 0.75 + 1 / (1 + Math.exp(-offset.value / 100)) - 0.5;
        groundWrapper.rotation.y += (finalValue - groundWrapper.rotation.y) * 0.05;
        if (!groundShake) {
          groundWrapper.position.y += -groundWrapper.position.y * 0.03;
          if (!groundShake && Math.abs(groundWrapper.position.y) < 0.05) {
            groundShake = 1;
            groundShakeTimeStart = time;
            if (props.onLoad) props.onLoad();
          }
        } else {
          groundWrapper.position.y += -Math.sin((time - groundShakeTimeStart) * 0.0015) * 0.0004;

          for (let i = 0; i < cars.length; i++) {
            cars[i].update(deltaTime);
          }

          if (time > lastCarSpawnTime) {
            lastCarSpawnTime = time + Math.random() * (carSpawnMaxTimeout - carSpawnBaseTimeout) + carSpawnBaseTimeout;
            cars.push(new Car(carObj));
          }
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
                style={{ width: props.width, height: props.height, ...props.styles }}
            />
        </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Neighbourhood;
