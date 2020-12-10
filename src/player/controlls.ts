import { Ray, Vector3 } from "@babylonjs/core";
import multiplyQuaternionByVector from "../utils/multiplyQuaternionByVector";
import char1 from "../../assets/textures/dungeonset/char1.png";

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
    console.log("try");
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
      console.log(camera.position);
      console.log(pickedUpMesh);
      console.log(player.holdingObject);
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

export function createGUI() {
  this.GUI = {
    container: document.createElement("div"),
    interact: document.createElement("div"),
    dialoge: document.createElement("div")
  };
  this.GUI.container.setAttribute("id", "GUI");
  this.GUI.container.classList.add("GUI");
  document.body.appendChild(this.GUI.container);
  document.getElementById("GUI").appendChild(this.GUI.dialoge);
  document.getElementById("GUI").appendChild(this.GUI.interact);
}

export function createDialogeGUI() {
  this.GUI.dialoge.innerHTML = ``;
  this.GUI.dialoge.setAttribute("id", "dialoge");
  this.GUI.dialoge.classList.add("dialoge");
  this.GUI.dialoge.style.display = "none";
}

export function createInteractGUI() {
  this.GUI.interact.innerHTML = ``;
  this.GUI.interact.setAttribute("id", "interact");
  this.GUI.interact.classList.add("interact");
  this.GUI.interact.style.display = "none";
}

export function openDialoge(name, img, text) {
  this.GUI.dialoge.innerHTML = `
    <div class="border">
      <div class="character">
        <div class="avatar">
          <div class="img" style="background-image: url('${img}')"></div>
        </div>
        <h2>${name}</h2>
      </div>
      <div class="text">
        <p>${text}</p>
      </div>  
    </div>
    <div class="tip">PRESS E TO CLOSE</div>`;
  this.GUI.dialoge.style.display = "flex";
}

export function closeDialoge() {
  this.GUI.dialoge.style.display = "none";
}

export function addDialogeControls() {
  let tryToTalk = () => {
    let origin = this.camera.position;
    let forward = this.camera.getFrontPosition(1);
    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);
    let length = 50;

    let ray = new Ray(origin, direction, length);

    let hit = this.scene.pickWithRay(ray);

    if (hit.pickedMesh && hit.pickedMesh.name.includes("char")) {
      this.targetFPC = hit.pickedMesh.name;
    } else {
      this.targetFPC = "";
    }

    let distanceFromCamera = 25;

    if (this.player.talkingTo != "") {
      //TODO: Here we should call for a dialoge window;
      this.openDialoge("Ramy", char1, "Greetings mate'!");
    }
  };
  this.scene.registerBeforeRender(() => {
    tryToTalk();
  });

  window.addEventListener("keypress", ev => {
    if (ev.key == "e" || ev.key == "E" || ev.key == "У" || ev.key == "у") {
    }
  });
}

function startHolding(mesh) {
  mesh.physicsImpostor.setParam("mass", 0);
}

function endHolding(mesh) {
  mesh.physicsImpostor.setParam("mass", 10);
}
