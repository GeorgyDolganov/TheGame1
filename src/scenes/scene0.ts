import {
  Color3,
  Mesh,
  OimoJSPlugin,
  PointLight,
  Quaternion,
  Scene,
  ShadowGenerator,
  UniversalCamera,
  Vector3,
  SceneLoader,
  AssetContainer,
  Texture,
  StandardMaterial,
  PhysicsImpostor,
  Color4, Effect, PostProcess, ParticleSystem, Ray,
} from '@babylonjs/core';
import oimo from 'oimophysics';
import createMaterials from '../materials';
import Elder from '../character/Elder';
import createMesh from '../utils/createMesh';
import fruitMesh from '../assets/models/fruit.babylon';
import fruitTexture from '../assets/models/FruitTexture2.png';
import altarMesh from '../assets/models/altar.babylon';
import altarTexture from '../assets/models/AltarTexture.png';
import shineTexture from '../assets/particles/Dot.png';
import '@babylonjs/loaders/glTF';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  fruit: any;

  altar: any;

  explosion: ParticleSystem;

  shiningParticles: ParticleSystem;

  constructor(engine, canvas) {
    this.scene = new Scene(engine);
    this.scene.collisionsEnabled = true;
    this.scene.clearColor = new Color4(0.20, 0.20, 0.2745, 1);
    this.scene.ambientColor = new Color3(1, 1, 1);
    this.scene.gravity = new Vector3(0, -10, 0);
    this.scene.fogMode = Scene.FOGMODE_EXP;
    this.scene.fogDensity = 0.01;
    this.scene.fogStart = 20.0;
    this.scene.fogEnd = 100.0;
    this.scene.fogColor = new Color3(0.20, 0.20, 0.2745);

    this.loadAssets();
    this.createLights();
    this.createShadows();
    this.createCamera(canvas);
    this.addPhysics();
    this.addMeshes();
    this.addCharacters();
    this.addParticles();
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
    this.camera.inertia = 0.6;
    this.camera.angularSensibility = 100000;
    this.camera.speed = 10;
    this.camera.ellipsoid = new Vector3(1, 10, 1);
    this.camera.applyGravity = true;
    // eslint-disable-next-line no-underscore-dangle
    this.camera.gamepadAngularSensibility = 100000;
    this.camera.gamepadMoveSensibility = 1000000;
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
      material: this.materials.floor.forest[0],
      checkCollisions: true,
      isPickable: false,
    }, [
      'BoxImpostor',
      { mass: 0, friction: 0.5, restitution: 0.7 },
    ]);

    const treesContainer = new AssetContainer(this.scene);
    const trees = [];
    for (let i = 0; i < 500; i += 1) {
      const tree = Math.floor(Math.random() * 4);
      trees[i] = createMesh(trees[i], 'CreatePlane', [
        `tree${i}`,
        { width: 48, height: tree !== 3 ? 112 : 96 },
        this.scene,
      ], {
        position: {
          x: (Math.round(Math.random()) * 2 - 1) * Math.random() * 1000,
          y: tree !== 3 ? 45 : 38,
          z: (Math.round(Math.random()) * 2 - 1) * Math.random() * 1000,
        },
        material: this.materials.trees.bluberry[tree],
        billboardMode: Mesh.BILLBOARDMODE_Y,
      });
      treesContainer.meshes.push(trees[i]);
    }

    SceneLoader.ImportMeshAsync('', '', fruitMesh, this.scene).then((result) => {
      // eslint-disable-next-line prefer-destructuring
      this.fruit = result.meshes[0];
      this.fruit.scaling = new Vector3(25, 25, 25);
      const texture = new Texture(fruitTexture, this.scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE);
      const material = new StandardMaterial('fruitMaterial', this.scene);
      material.disableLighting = true;
      material.sideOrientation = this.fruit.material.sideOrientation;
      material.emissiveTexture = texture;
      material.forceDepthWrite = true;
      material.reservedDataStore = { hidden: true };
      this.fruit.material = material;
      this.fruit.id = 'physFruit';
      this.fruit.name = 'physFruit';
      this.fruit.checkCollisions = true;
      this.fruit.position.set(100, 2, 100);
      this.shiningParticles.emitter = this.fruit;
      this.fruit.physicsImpostor = new PhysicsImpostor(
        this.fruit,
        PhysicsImpostor.MeshImpostor,
        { mass: 100000, restitution: 0, friction: 1 },
      );
      const pickUpListener$ = fromEvent(document, 'keydown').pipe(
        filter(
          (ev: KeyboardEvent) =>
            ev.key === 'e' || ev.key === 'E' || ev.key === 'У' || ev.key === 'у',
        ),
      );
      pickUpListener$.subscribe(() => {
        const origin = this.camera.position;
        const forward = this.camera.getFrontPosition(1);
        let direction = forward.subtract(origin);
        direction = Vector3.Normalize(direction);
        const length = 50;
        const ray = new Ray(origin, direction, length);
        const hit = this.scene.pickWithRay(ray);
        if (hit?.pickedMesh?.name === 'physFruit') {
          this.shiningParticles.stop();
        }
      });
      const dummy = new Mesh(
        'physFruit-dummy',
        this.scene,
      );
      dummy.rotationQuaternion = new Quaternion();
      console.log(result);
    });

    SceneLoader.ImportMeshAsync('', '', altarMesh, this.scene).then((result) => {
      // eslint-disable-next-line prefer-destructuring
      this.altar = result.meshes[0];
      this.altar.scaling = new Vector3(15, 15, 15);
      const texture = new Texture(altarTexture, this.scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE);
      const material = new StandardMaterial('altarMaterial', this.scene);
      material.disableLighting = true;
      material.sideOrientation = this.altar.material.sideOrientation;
      material.emissiveTexture = texture;
      material.forceDepthWrite = true;
      material.reservedDataStore = { hidden: true };
      this.altar.material = material;
      this.altar.id = 'altar';
      this.altar.name = 'altar';
      this.altar.checkCollisions = true;
      this.altar.position.set(-100, -2, -100);
      this.altar.physicsImpostor = new PhysicsImpostor(
        this.altar,
        PhysicsImpostor.MeshImpostor,
        { mass: 10000000, restitution: 0, friction: 1 },
      );
      console.log(result);
      console.log(result);
    });

    // this.physSphere = createMesh(this.physSphere, 'CreateSphere', [
    //   'physSphere',
    //   { diameter: 5, segments: 15, updatable: true },
    //   this.scene,
    // ], {
    //   position: {
    //     x: 0,
    //     y: 30,
    //     z: -100,
    //   },
    //   material: this.materials.enviroment.red,
    //   checkCollisions: true,
    //   isPickable: true,
    // }, [
    //   'SphereImpostor',
    //   { mass: 99999, restitution: 0.98, friction: 0.2 },
    // ]);
  }

  private addCharacters() {
    this.characters = {
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
    const gravityVector = new Vector3(0, -39.81, 0);
    const physicsPlugin = new OimoJSPlugin(null, oimo);
    this.scene.enablePhysics(gravityVector, physicsPlugin);

    const playerImpulse = 100;
    this.camera.onCollide = (mesh) => {
      if (mesh.name.includes('phys')) {
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

  addParticles() {
    this.shiningParticles = new ParticleSystem('shiningParticles', 2000, this.scene);
    this.shiningParticles.particleTexture = new Texture(shineTexture, this.scene);
    this.shiningParticles.emitRate = 20;
    this.shiningParticles.maxLifeTime = 1;
    this.shiningParticles.minSize = 0.1;
    this.shiningParticles.maxSize = 2;
    this.shiningParticles.color2 = new Color4(49.3563, 37.4926, 4.6354, 1);
    this.shiningParticles.color1 = new Color4(49.3563, 37.4926, 4.6354, 1);
    //this.shiningParticles.colorDead = new Color4(49.3563, 37.4926, 4.6354, 1);
    this.shiningParticles.direction1 = new Vector3(0.3, 1, 0);
    this.shiningParticles.direction2 = new Vector3(0.3, 1, 0);
    this.shiningParticles.start();
  }

  private renderLoop(engine) {
    engine.runRenderLoop(() => {
      this.scene.render();
    });
  }
}
