import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import {
  Engine,
  Scene,
  UniversalCamera,
  Vector3,
  Mesh,
  MeshBuilder,
  Color3,
  StandardMaterial,
  Quaternion,
  Axis,
  PhysicsImpostor,
  ShadowGenerator,
  OimoJSPlugin,
  PointLight,
  Texture,
  AssetsManager,
  SpritePackedManager,
  Ray
} from "@babylonjs/core";
import oimo from "oimophysics";
import { fromEvent } from 'rxjs';
(global as any).OIMO = require("oimophysics");

import player from "./player";
import createMaterials from "./materials";

import multiplyQuaternionByVector from "./utils/multiplyQuaternionByVector";

import char1 from "../assets/textures/dungeonset/char1.png";

import "./GUI/style/GUI.scss";
import Player from "./player";

class App {
  camera: UniversalCamera;
  canvas: HTMLCanvasElement;
  engine: Engine;
  scene: Scene;

  player1: Player;

  materials: any;

  GUI: {
    container: HTMLDivElement;
    dialoge: HTMLDivElement;
    interact: HTMLDivElement;
  };

  SPM: SpritePackedManager;
  assetsManager: AssetsManager;

  light1: PointLight;
  shadowGenerator: ShadowGenerator;

  player: {
    holdingObject: string;
    talkingTo: string;
  };

  ground: Mesh;
  softSphere: Mesh;
  roof: Mesh;
  wall1: Mesh;
  wall2: Mesh;
  wall3: Mesh;
  wall4: Mesh;

  targetFPC: string;

  guy: Mesh;
  monster: Mesh;
  hand: Mesh;

  constructor() {
    this._createApp();

    this._initVars();

    this._loadAssets();

    this._createCamera();

    this._createLights();
    this._createShadows();

    this._createGround();
    this._createBox();

    this._createMeshes();

    this._createSprites();
    this.player1 = new Player(this.canvas, this.scene, this.camera);

    this._createGUI();
    this._createDialogeGUI();

    //this._addPickingUpControls();

    this._createPhysics();

    this._renderLoop();
  }

  private _createApp() {
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.id = "gameCanvas";
    document.body.appendChild(this.canvas);
    this.engine = new Engine(this.canvas, true);

    this.scene = new Scene(this.engine);
    this.scene.collisionsEnabled = true;
    this.scene.ambientColor = new Color3(1, 1, 1);
    this.scene.gravity = new Vector3(0, -10, 0);
  }

  private _initVars() {
    this.player = {
      holdingObject: "",
      talkingTo: ""
    };
  }

  private _loadAssets() {
    this.materials = createMaterials(this.scene); 
  }

  private _createCamera() {
    this.camera = new UniversalCamera(
      "PlayerCamera",
      new Vector3(0, 0, 0),
      this.scene
    );
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(this.canvas, true);
    this.camera.rotationQuaternion = new Quaternion();
    this.camera.checkCollisions = true;
    this.camera.position.y = 10;
    this.camera.inertia = 0.4;
    this.camera.angularSensibility = 4000;
    this.camera.speed = 15;
    this.camera.ellipsoid = new Vector3(1, 10, 1);
    this.camera.applyGravity = true;

    this.scene.activeCamera = this.camera;
  }

  private _createLights() {
    this.light1 = new PointLight("dir1", new Vector3(0, 100, 0), this.scene);
    this.light1.range = 500;
  }

  private _createShadows() {
    this.shadowGenerator = new ShadowGenerator(2048, this.light1);
  }

  private _createGround() {
    this.ground = MeshBuilder.CreateBox(
      "ground",
      { width: 10000, depth: 10000, height: 2 },
      this.scene
    );
    this.ground.position.y = -10;
    this.ground.material = this.materials.enviroment.ground;
    this.ground.checkCollisions = true;
    this.ground.isPickable = false;
  }

  private _createBox() {
    this.roof = MeshBuilder.CreateBox(
      "roof",
      { width: 10000, depth: 10000, height: 2 },
      this.scene
    );
    this.roof.position.y = 60;
    this.roof.isPickable = false;
    this.roof.material = this.materials.enviroment.ground;

    this.wall1 = MeshBuilder.CreateBox(
      "wall1",
      { width: 1000, height: 100 },
      this.scene
    );
    this.wall1.checkCollisions = true;
    this.wall1.rotation.y = 0;
    this.wall1.position.z = 200;
    this.wall1.position.y = 10;
    this.wall1.isPickable = false;
    this.wall1.material = this.materials.enviroment.wall;

    this.wall2 = MeshBuilder.CreateBox(
      "wall2",
      { width: 1000, height: 100 },
      this.scene
    );
    this.wall2.checkCollisions = true;
    this.wall2.rotation.y = 0;
    this.wall2.position.z = -300;
    this.wall2.position.y = 10;
    this.wall2.isPickable = false;
    this.wall2.material = this.materials.enviroment.wall;

    this.wall3 = MeshBuilder.CreateBox(
      "wall3",
      { width: 1000, height: 100 },
      this.scene
    );

    this.wall3.rotationQuaternion = Quaternion.RotationAxis(Axis.Y, 1.57);
    this.wall3.checkCollisions = true;
    this.wall3.rotation.y = 180;
    this.wall3.position.z = -100;
    this.wall3.position.x = -300;
    this.wall3.position.y = 10;
    this.wall3.isPickable = false;
    this.wall3.material = this.materials.enviroment.wall;

    this.wall4 = MeshBuilder.CreateBox(
      "wall4",
      { width: 1000, height: 100 },
      this.scene
    );

    this.wall4.rotationQuaternion = Quaternion.RotationAxis(Axis.Y, 1.57);
    this.wall4.checkCollisions = true;
    this.wall4.position.z = -100;
    this.wall4.position.x = 300;
    this.wall4.position.y = 10;
    this.wall4.isPickable = false;
    this.wall4.material = this.materials.enviroment.wall;
  }

  private _createSprites() {
    this.guy = MeshBuilder.CreatePlane("guy", { size: 30 }, this.scene);
    this.guy.position.y = 7;
    this.guy.rotation.x = Math.PI;
    this.guy.position.z = -150;
    this.guy.material = this.materials.sprites.guy;
    this.guy.isPickable = false;

    this.monster = MeshBuilder.CreatePlane("monster", { size: 50 }, this.scene);
    this.monster.position.y = 20;
    this.monster.rotation.x = Math.PI;
    this.monster.position.z = -200;
    this.monster.material = this.materials.sprites.monster;
    this.monster.isPickable = false;
  }

  private _createMeshes() {
    this.softSphere = MeshBuilder.CreateSphere(
      "obj-softSphere",
      { diameter: 10, segments: 38, updatable: true },
      this.scene
    );
    this.softSphere.position.y = 30;
    this.softSphere.position.z = -100;
    this.softSphere.checkCollisions = true;
    this.softSphere.material = this.materials.enviroment.red;
    this.softSphere.isPickable = true;
    this.shadowGenerator.getShadowMap().renderList.push(this.softSphere);
  }

  private _createPhysics() {
    var gravityVector = new Vector3(0, -9.8, 0);
    var physicsPlugin = new OimoJSPlugin(null, oimo);
    this.scene.enablePhysics(gravityVector, physicsPlugin);
    var physicsEngine = this.scene.getPhysicsEngine();
    console.log(physicsEngine);

    this.softSphere.physicsImpostor = new PhysicsImpostor(
      this.softSphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 5, restitution: 1 },
      this.scene
    );

    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0.7 },
      this.scene
    );
    this.ground.receiveShadows = true;
    this.wall1.physicsImpostor = new PhysicsImpostor(
      this.wall1,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene
    );

    this.wall2.physicsImpostor = new PhysicsImpostor(
      this.wall2,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene
    );

    this.wall3.physicsImpostor = new PhysicsImpostor(
      this.wall3,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene
    );

    this.wall4.physicsImpostor = new PhysicsImpostor(
      this.wall4,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene
    );

    this.roof.physicsImpostor = new PhysicsImpostor(
      this.roof,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene
    );

    var playerImpulse = 100;

    this.camera.onCollide = mesh => {
      if (mesh.name == "softSphere") {
        //we can check if mesh is in pushable collection later
        var givenVelocity = playerImpulse / mesh.physicsImpostor.mass;
        var movementDirectionVector = this.camera.position
          .subtract(mesh.getAbsolutePosition())
          .negate();
        mesh.physicsImpostor.setLinearVelocity(
          movementDirectionVector.scale(givenVelocity)
        );
      }
    };
  }

  private _createGUI() {
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

  private _createDialogeGUI() {
    this.GUI.dialoge.innerHTML = ``;
    this.GUI.dialoge.setAttribute("id", "dialoge");
    this.GUI.dialoge.classList.add("dialoge");
    this.GUI.dialoge.style.display = "none";
  }

  private _createInteractGUI() {
    this.GUI.interact.innerHTML = ``;
    this.GUI.interact.setAttribute("id", "interact");
    this.GUI.interact.classList.add("interact");
    this.GUI.interact.style.display = "none";
  }

  public openDialoge(name, img, text) {
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

  public _closeDialoge() {
    this.GUI.dialoge.style.display = "none";
  }

  private _addDialogeControls() {
    let tryToTalk = () => {
      let origin = this.camera.position;
      let forward = this.camera.getFrontPosition(1);
      let direction = forward.subtract(origin);
      direction = Vector3.Normalize(direction);
      let length = 50;
      
      let ray = new Ray(origin,direction,length);

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

    }
    this.scene.registerBeforeRender(() => {
      tryToTalk();
    });
    
    window.addEventListener("keypress", ev => {
      if (ev.key == "e" || ev.key == "E" || ev.key == "У" || ev.key == "у") {

      } 
    })
  }

  private _renderLoop() {
    this.engine.runRenderLoop(() => {
      this.guy.lookAt(this.camera.position, Math.PI);
      this.monster.lookAt(this.camera.position, Math.PI);
      this.scene.render();
    });
  }
}

new App();
