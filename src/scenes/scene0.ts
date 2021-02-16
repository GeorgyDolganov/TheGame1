import {
  Axis,
  Color3,
  Mesh,
  OimoJSPlugin,
  PointLight,
  Quaternion,
  Scene,
  ShadowGenerator,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';
import oimo from 'oimophysics';
import createMaterials from '../materials';
import Ramy from '../character/Ramy';
import Monster from '../character/Monster';
import Elder from '../character/Elder';
import createMesh from '../utils/createMesh';

export default class Scene0 {
  public scene: Scene;

  public camera: UniversalCamera;

  materials: any;

  light1: PointLight;

  shadowGenerator: ShadowGenerator;

  ground: Mesh;

  roof: Mesh;

  wall1: Mesh;

  wall2: Mesh;

  wall3: Mesh;

  wall4: Mesh;

  physSphere: Mesh;

  characters: object;

  constructor(engine, canvas) {
    this.scene = new Scene(engine);
    this.scene.collisionsEnabled = true;
    this.scene.ambientColor = new Color3(1, 1, 1);
    this.scene.gravity = new Vector3(0, -10, 0);

    this.loadAssets();
    this.createLights();
    this.createShadows();
    this.createCamera(canvas);
    this.addPhysics();
    this.addMeshes();
    this.addCharacters();
    this.renderLoop(engine);
  }

  private loadAssets() {
    this.materials = createMaterials(this.scene);
  }

  private createLights() {
    this.light1 = new PointLight('light1', new Vector3(0, 100, 0), this.scene);
    this.light1.range = 500;
  }

  private createShadows() {
    this.shadowGenerator = new ShadowGenerator(2048, this.light1);
  }

  private createCamera(canvas) {
    this.camera = new UniversalCamera(
      'PlayerCamera',
      new Vector3(0, 0, 0),
      this.scene,
    );
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(canvas, true);
    this.camera.rotationQuaternion = new Quaternion();
    this.camera.checkCollisions = true;
    this.camera.position.y = 22;
    this.camera.inertia = 0.4;
    this.camera.angularSensibility = 4000;
    this.camera.speed = 15;
    this.camera.ellipsoid = new Vector3(1, 10, 1);
    this.camera.applyGravity = true;

    this.scene.activeCamera = this.camera;
  }

  private addMeshes() {
    this.ground = createMesh(this.ground, 'CreateBox', [
      'ground',
      { width: 10000, depth: 10000, height: 2 },
      this.scene,
    ], {
      position: {
        x: 0,
        y: -10,
        z: 0,
      },
      material: this.materials.enviroment.ground,
      checkCollisions: true,
      isPickable: false,
    }, [
      'BoxImpostor',
      { mass: 0, friction: 0.5, restitution: 0.7 },
    ]);

    this.roof = createMesh(this.roof, 'CreateBox', [
      'roof',
      { width: 10000, depth: 10000, height: 2 },
      this.scene,
    ], {
      position: {
        x: 0,
        y: 50,
        z: 0,
      },
      material: this.materials.enviroment.ground,
      checkCollisions: true,
      isPickable: false,
    }, [
      'BoxImpostor',
      { mass: 0, friction: 0.5, restitution: 0.7 },
    ]);

    this.wall1 = createMesh(this.wall1, 'CreateBox', [
      'wall1',
      { width: 1000, height: 100 },
      this.scene,
    ], {
      position: {
        x: 0,
        y: 10,
        z: 200,
      },
      material: this.materials.enviroment.wall,
      checkCollisions: true,
      isPickable: false,
    }, [
      'BoxImpostor',
      { mass: 0, friction: 0.5, restitution: 0 },
    ]);

    this.wall2 = createMesh(this.wall2, 'CreateBox', [
      'wall2',
      { width: 1000, height: 100 },
      this.scene,
    ], {
      position: {
        x: 0,
        y: 10,
        z: -300,
      },
      material: this.materials.enviroment.wall,
      checkCollisions: true,
      isPickable: false,
    }, [
      'BoxImpostor',
      { mass: 0, friction: 0.5, restitution: 0 },
    ]);

    this.wall3 = createMesh(this.wall3, 'CreateBox', [
      'wall3',
      { width: 1000, height: 100 },
      this.scene,
    ], {
      position: {
        x: -300,
        y: 10,
        z: -100,
      },
      material: this.materials.enviroment.wall,
      checkCollisions: true,
      isPickable: false,
      rotationQuaternion: Quaternion.RotationAxis(Axis.Y, 1.57),
    }, [
      'BoxImpostor',
      { mass: 0, friction: 0.5, restitution: 0 },
    ]);

    this.wall4 = createMesh(this.wall4, 'CreateBox', [
      'wall4',
      { width: 1000, height: 100 },
      this.scene,
    ], {
      position: {
        x: 300,
        y: 10,
        z: -100,
      },
      material: this.materials.enviroment.wall,
      checkCollisions: true,
      isPickable: false,
      rotationQuaternion: Quaternion.RotationAxis(Axis.Y, 1.57),
    }, [
      'BoxImpostor',
      { mass: 0, friction: 0.5, restitution: 0 },
    ]);

    this.physSphere = createMesh(this.physSphere, 'CreateSphere', [
      'physSphere',
      { diameter: 5, segments: 15, updatable: true },
      this.scene,
    ], {
      position: {
        x: 0,
        y: 30,
        z: -100,
      },
      material: this.materials.enviroment.red,
      checkCollisions: true,
      isPickable: true,
    }, [
      'SphereImpostor',
      { mass: 99999, restitution: 0.98, friction: 0.2 },
    ]);
  }

  private addCharacters() {
    this.characters = {
      char_Ramy: new Ramy({
        scene: this.scene,
        materials: this.materials,
      }),
      char_Monster: new Monster({
        scene: this.scene,
        materials: this.materials,
      }),
      char_Elder: new Elder(
        {
          scene: this.scene,
          materials: this.materials,
        },
        {
          rows: 2,
          columns: 2,
          frames: 3,
          speed: 200,
        },
      ),
    };
  }

  private addPhysics() {
    const gravityVector = new Vector3(0, -9.81, 0);
    const physicsPlugin = new OimoJSPlugin(null, oimo);
    this.scene.enablePhysics(gravityVector, physicsPlugin);

    const playerImpulse = 100;
    this.camera.onCollide = (mesh) => {
      if (mesh.name === 'physSphere') {
        // we can check if mesh is in pushable collection later
        const givenVelocity = playerImpulse / mesh.physicsImpostor.mass;
        const movementDirectionVector = this.camera.position
          .subtract(mesh.getAbsolutePosition())
          .negate();
        mesh.physicsImpostor.setLinearVelocity(
          movementDirectionVector.scale(givenVelocity),
        );
      }
    };
  }

  private renderLoop(engine) {
    engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
