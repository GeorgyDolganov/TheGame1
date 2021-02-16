/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { Ray, Vector3 } from '@babylonjs/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import multiplyQuaternionByVector from '../utils/multiplyQuaternionByVector';

const distanceFromCamera = 25;

export const addFirstPersonControls = (canvas, scene, camera) => {
  camera.keysUp.push(87); // 'w'
  camera.keysDown.push(83); // 's'
  camera.keysLeft.push(65); // 'a'
  camera.keysRight.push(68); // 'd'
  camera.angularSensibility = 5000;
  const debugEvent$ = fromEvent(document, 'keydown').pipe(
    filter(
      (ev: KeyboardEvent) => ev.shiftKey
        && ev.ctrlKey
        && ev.altKey
        && (ev.key === 'I'
        || ev.key === 'i'
        || ev.key === 'Ш'
        || ev.key === 'ш'),
    ),
  );
  debugEvent$.subscribe(() => {
    if (scene.debugLayer.isVisible()) {
      scene.debugLayer.hide();
    } else {
      scene.debugLayer.show();
    }
  });

  let isLocked = false;
  scene.onPointerDown = () => {
    if (!isLocked) {
      canvas.requestPointerLock = canvas.requestPointerLock
      || canvas.msRequestPointerLock
      || canvas.mozRequestPointerLock
      || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }
  };
  const pointerLockChange = () => {
    const controlEnabled = document.pointerLockElement || false;

    if (!controlEnabled) {
      camera.detachControl(canvas);
      isLocked = false;
    } else {
      camera.attachControl(canvas);
      isLocked = true;
    }
  };

  window.addEventListener('pointerlockchange', pointerLockChange, false);
  window.addEventListener('mspointerlockchange', pointerLockChange, false);
  window.addEventListener('mozpointerlockchange', pointerLockChange, false);
  window.addEventListener('webkitpointerlockchange', pointerLockChange, false);
};

export function addPickingUpControls(scene, camera, player) {
  let targetFPC = '';

  const tryToGrab = () => {
    const origin = camera.position;
    const forward = camera.getFrontPosition(1);
    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);
    const length = 50;

    const ray = new Ray(origin, direction, length);

    const hit = scene.pickWithRay(ray);

    if (hit.pickedMesh && hit.pickedMesh.name.includes('phys')) {
      targetFPC = hit.pickedMesh.name;
    } else {
      targetFPC = '';
    }

    if (player.holdingObject !== '') {
      const pickedUpMesh = scene.getMeshByName(player.holdingObject);
      const pickedUpDummy = scene.getMeshByName(`${player.holdingObject}-dummy`);
      // Clone of the camera's quaternion
      const cameraQuaternion = camera.rotationQuaternion.clone();
      // Vector3 (Z-axis/direction)
      const directionVector = new Vector3(0, 0, distanceFromCamera);
      // Quaternion/Vector3 multiplication.
      // Function shamelessly stolen from CannonJS's Quaternion class
      const rotationVector = multiplyQuaternionByVector(cameraQuaternion, directionVector);
      // New position based on camera position and direction vector
      pickedUpDummy.position.set(
        camera.position.x + rotationVector.x,
        camera.position.y + rotationVector.y,
        camera.position.z + rotationVector.z,
      );
      const velocityDirectionVector = pickedUpDummy.position.subtract(pickedUpMesh.position);
      console.log(pickedUpMesh.physicsImpostor._physicsBody);
      pickedUpMesh.physicsImpostor._physicsBody.linearVelocity.set(
        velocityDirectionVector.x * 10,
        velocityDirectionVector.y * 10,
        velocityDirectionVector.z * 10,
      );
      pickedUpMesh.physicsImpostor._physicsBody.angularVelocity.set(0, 0, 0);
    }
  };

  scene.registerBeforeRender(() => {
    tryToGrab();
  });

  const pickUpEvent$ = fromEvent(document, 'keydown').pipe(
    filter(
      (ev: KeyboardEvent) => ev.key === 'e'
      || ev.key === 'E'
      || ev.key === 'У'
      || ev.key === 'у',
    ),
  );
  pickUpEvent$.subscribe(() => {
    console.log(targetFPC);
    if (
      targetFPC !== ''
      && player.holdingObject === ''
      && scene.getMeshByName(targetFPC).isPickable === true
    ) {
      console.log('!');
      player.holdingObject = targetFPC;
    } else if (player.holdingObject !== '') {
      console.log('!');
      player.holdingObject = '';
    }
  });
  const throwEvent$ = fromEvent(document, 'click');
  throwEvent$.subscribe(() => {
    if (player.holdingObject !== '') {
      console.log('THROW');
      const pickedUpMesh = scene.getMeshByName(player.holdingObject);
      const cameraQuaternion = camera.rotationQuaternion.clone();
      // Vector3 (Z-axis/direction)
      const directionVector = new Vector3(0, 0, distanceFromCamera);
      // Quaternion/Vector3 multiplication.
      // Function shamelessly stolen from CannonJS's Quaternion class
      const rotationVector = multiplyQuaternionByVector(cameraQuaternion, directionVector);
      pickedUpMesh.physicsImpostor._physicsBody.linearVelocity.set(
        rotationVector.x * 5,
        rotationVector.y * 5,
        rotationVector.z * 5,
      );
      player.holdingObject = '';
    }
  });

  // return targetFPC;
}

export function addDialogeControls(level, player) {
  let targetFPC = '';

  const findSomeoneToTalkTo = () => {
    const origin = level.camera.position;
    const forward = level.camera.getFrontPosition(1);
    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);
    const length = 50;

    const ray = new Ray(origin, direction, length);

    const hit = level.scene.pickWithRay(ray);

    if (hit.pickedMesh && hit.pickedMesh.name.includes('char')) {
      targetFPC = hit.pickedMesh.name;
    } else {
      targetFPC = '';
    }

    if (player.talkingTo !== '') {
      // TODO: Here we should call for a dialoge window;
    }
  };

  level.scene.registerBeforeRender(() => {
    findSomeoneToTalkTo();
  });

  const talkToEvent$ = fromEvent(document, 'keydown').pipe(
    filter(
      (ev: KeyboardEvent) =>
        ev.key === 'e' || ev.key === 'E' || ev.key === 'У' || ev.key === 'у',
    ),
  );
  talkToEvent$.subscribe(() => {
    console.log(targetFPC);
    console.log(level.characters);
    console.log(targetFPC !== '');
    if (targetFPC !== '') {
      console.log(level.characters[targetFPC]);
      level.characters[targetFPC].talkTo(targetFPC);
    }
  });
}
