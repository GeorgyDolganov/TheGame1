import {
  Axis,
  Color3,
  Mesh,
  MeshBuilder,
  OimoJSPlugin,
  PhysicsImpostor,
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

  softSphere: Mesh;

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
    this.addMeshes();
    this.addCharacters();
    this.addPhysics();
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
    this.ground = MeshBuilder.CreateBox(
      'ground',
      { width: 10000, depth: 10000, height: 2 },
      this.scene,
    );
    this.ground.position.y = -10;
    this.ground.material = this.materials.enviroment.ground;
    this.ground.checkCollisions = true;
    this.ground.isPickable = false;

    this.roof = MeshBuilder.CreateBox(
      'roof',
      { width: 10000, depth: 10000, height: 2 },
      this.scene,
    );
    this.roof.position.y = 60;
    this.roof.isPickable = false;
    this.roof.material = this.materials.enviroment.ground;

    this.wall1 = MeshBuilder.CreateBox(
      'wall1',
      { width: 1000, height: 100 },
      this.scene,
    );
    this.wall1.checkCollisions = true;
    this.wall1.rotation.y = 0;
    this.wall1.position.z = 200;
    this.wall1.position.y = 10;
    this.wall1.isPickable = false;
    this.wall1.material = this.materials.enviroment.wall;

    this.wall2 = MeshBuilder.CreateBox(
      'wall2',
      { width: 1000, height: 100 },
      this.scene,
    );
    this.wall2.checkCollisions = true;
    this.wall2.rotation.y = 0;
    this.wall2.position.z = -300;
    this.wall2.position.y = 10;
    this.wall2.isPickable = false;
    this.wall2.material = this.materials.enviroment.wall;

    this.wall3 = MeshBuilder.CreateBox(
      'wall3',
      { width: 1000, height: 100 },
      this.scene,
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
      'wall4',
      { width: 1000, height: 100 },
      this.scene,
    );

    this.wall4.rotationQuaternion = Quaternion.RotationAxis(Axis.Y, 1.57);
    this.wall4.checkCollisions = true;
    this.wall4.position.z = -100;
    this.wall4.position.x = 300;
    this.wall4.position.y = 10;
    this.wall4.isPickable = false;
    this.wall4.material = this.materials.enviroment.wall;

    this.softSphere = MeshBuilder.CreateSphere(
      'obj-softSphere',
      { diameter: 10, segments: 38, updatable: true },
      this.scene,
    );
    this.softSphere.position.y = 30;
    this.softSphere.position.z = -100;
    this.softSphere.checkCollisions = true;
    this.softSphere.material = this.materials.enviroment.red;
    this.softSphere.isPickable = true;
    this.shadowGenerator.getShadowMap().renderList.push(this.softSphere);
  }

  private addCharacters() {
    this.characters = {
      char_Ramy: new Ramy({
        scene: this.scene, materials: this.materials,
      }),
      char_Monster: new Monster({
        scene: this.scene, materials: this.materials,
      }),
    };
  }

  private addPhysics() {
    const gravityVector = new Vector3(0, -9.8, 0);
    const physicsPlugin = new OimoJSPlugin(null, oimo);
    this.scene.enablePhysics(gravityVector, physicsPlugin);
    const physicsEngine = this.scene.getPhysicsEngine();
    console.log(physicsEngine);

    this.softSphere.physicsImpostor = new PhysicsImpostor(
      this.softSphere,
      PhysicsImpostor.SphereImpostor,
      { mass: 5, restitution: 1 },
      this.scene,
    );

    this.ground.physicsImpostor = new PhysicsImpostor(
      this.ground,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0.7 },
      this.scene,
    );
    this.ground.receiveShadows = true;
    this.wall1.physicsImpostor = new PhysicsImpostor(
      this.wall1,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene,
    );

    this.wall2.physicsImpostor = new PhysicsImpostor(
      this.wall2,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene,
    );

    this.wall3.physicsImpostor = new PhysicsImpostor(
      this.wall3,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene,
    );

    this.wall4.physicsImpostor = new PhysicsImpostor(
      this.wall4,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene,
    );

    this.roof.physicsImpostor = new PhysicsImpostor(
      this.roof,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0.5, restitution: 0 },
      this.scene,
    );

    const playerImpulse = 100;

    this.camera.onCollide = (mesh) => {
      if (mesh.name === 'obj-softSphere') {
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
