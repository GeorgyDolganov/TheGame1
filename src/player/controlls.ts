import { Ray, Vector3 } from "@babylonjs/core";
import multiplyQuaternionByVector from "../utils/multiplyQuaternionByVector";

export function addFirstPersonControls(canvas, scene, camera) {
  camera.keysUp.push(87); // "w"
  camera.keysDown.push(83); // "s"
  camera.keysLeft.push(65); // "a"
  camera.keysRight.push(68); // "d"
  camera.angularSensibility = 5000;

  window.addEventListener("keydown", ev => {
    if (
      ev.shiftKey &&
      ev.ctrlKey &&
      ev.altKey &&
      (ev.key === "I" || ev.key === "i" || ev.key === "Ш" || ev.key === "ш")
    ) {
      if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
      } else {
        scene.debugLayer.show();
      }
    }
  });

  let isLocked = false;
  scene.onPointerDown = () => {
    if (!isLocked) {
      canvas.requestPointerLock =
        canvas.requestPointerLock ||
        canvas.msRequestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    }
  };
  var pointerLockChange = () => {
    var controlEnabled = document.pointerLockElement || false;

    if (!controlEnabled) {
      camera.detachControl(canvas);
      isLocked = false;
    } else {
      camera.attachControl(canvas);
      isLocked = true;
    }
  };

  window.addEventListener("pointerlockchange", pointerLockChange, false);
  window.addEventListener("mspointerlockchange", pointerLockChange, false);
  window.addEventListener("mozpointerlockchange", pointerLockChange, false);
  window.addEventListener("webkitpointerlockchange", pointerLockChange, false);
}

export function addPickingUpControls(scene, camera, player) {
  var targetFPC = "";

  let tryToGrab = () => {
    let origin = camera.position;
    let forward = camera.getFrontPosition(1);
    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);
    let length = 50;

    let ray = new Ray(origin, direction, length);

    let hit = scene.pickWithRay(ray);

    if (hit.pickedMesh && hit.pickedMesh.name.includes("obj")) {
      targetFPC = hit.pickedMesh.name;
    } else {
      targetFPC = "";
    }

    let distanceFromCamera = 25;

    if (player.holdingObject != "") {
      let pickedUpMesh = scene.getMeshByName(player.holdingObject);
      //Clone of the camera's quaternion
      var cameraQuaternion = camera.rotationQuaternion.clone();
      //Vector3 (Z-axis/direction)
      var directionVector = new Vector3(0, 0, distanceFromCamera);
      //Quaternion/Vector3 multiplication. Function shamelessly stolen from CannonJS's Quaternion class
      var rotationVector = multiplyQuaternionByVector(
        cameraQuaternion,
        directionVector
      );
      //New position based on camera position and direction vector
      pickedUpMesh.position.set(
        camera.position.x + rotationVector.x,
        camera.position.y + rotationVector.y,
        camera.position.z + rotationVector.z
      );
    }
  };

  scene.registerBeforeRender(() => {
    tryToGrab();
  });

  window.addEventListener("keypress", ev => {
    if (ev.key == "e" || ev.key == "E" || ev.key == "У" || ev.key == "у") {
      console.log(ev.key);
      console.log(targetFPC);
      if (
        targetFPC != "" &&
        player.holdingObject == "" &&
        scene.getMeshByName(targetFPC).isPickable == true
      ) {
        console.log("!");
        player.holdingObject = targetFPC;
        startHolding(scene.getMeshByName(player.holdingObject));
      } else if (player.holdingObject != "") {
        console.log("!");
        endHolding(scene.getMeshByName(player.holdingObject));
        player.holdingObject = "";
      }
    }
  });
  window.addEventListener("click", ev => {
    if (player.holdingObject != "") {
      console.log("THROW");
    }
  });

  //return targetFPC;
}

function startHolding(mesh) {
  mesh.physicsImpostor.setParam("mass", 0);
}

function endHolding(mesh) {
  mesh.physicsImpostor.setParam("mass", 10);
}

export function addDialogeControls(level, player) {
  var targetFPC = "";
  
  let findSomeoneToTalkTo = () => {
    let origin = level.camera.position;
    let forward = level.camera.getFrontPosition(1);
    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);
    let length = 50;

    let ray = new Ray(origin, direction, length);

    let hit = level.scene.pickWithRay(ray);

    if (hit.pickedMesh && hit.pickedMesh.name.includes("char")) {
      targetFPC = hit.pickedMesh.name;
    } else {
      targetFPC = "";
    }

    let distanceFromCamera = 25;

    if (player.talkingTo != "") {
      //TODO: Here we should call for a dialoge window;
    }
  };

  level.scene.registerBeforeRender(() => {
    findSomeoneToTalkTo();
  });

  window.addEventListener("keypress", ev => {
    if (ev.key == "e" || ev.key == "E" || ev.key == "У" || ev.key == "у") {
      console.log(ev.key);
      if (targetFPC != "") {
        level.characters[targetFPC].talkTo();
      };
    }
  });
}
