import { Color3, StandardMaterial } from '@babylonjs/core';
import createTextures from './textures';

interface Materials {
  enviroment: {
    red: StandardMaterial;
    ground: StandardMaterial;
    wall: StandardMaterial;
  };
  sprites: {
    guy: StandardMaterial;
    monster: StandardMaterial;
  };
}

export default function createMaterials(scene) {
  const textures = createTextures(scene);
  const materials: Materials = {
    enviroment: {
      red: new StandardMaterial('redMat', scene),
      wall: new StandardMaterial('wallMat', scene),
      ground: new StandardMaterial('groundMat', scene),
    },
    sprites: {
      guy: new StandardMaterial('guyTexture', scene),
      monster: new StandardMaterial('monsterTexture', scene),
    },
  };

  materials.enviroment.red.emissiveColor = new Color3(1, 0, 0);

  materials.enviroment.wall.diffuseTexture = textures.dungeonset.wall1;

  materials.enviroment.ground.diffuseTexture = textures.dungeonset.floor;

  materials.enviroment.ground.emissiveColor = new Color3(1, 1, 1);
  materials.enviroment.wall.emissiveColor = new Color3(1, 1, 1);
  materials.enviroment.ground.disableLighting = true;
  materials.enviroment.wall.disableLighting = true;

  materials.sprites.guy.diffuseTexture = textures.dungeonset.char1;
  materials.sprites.guy.diffuseTexture.hasAlpha = true;
  materials.sprites.monster.diffuseTexture = textures.dungeonset.monster1;
  materials.sprites.monster.diffuseTexture.hasAlpha = true;
  materials.sprites.guy.emissiveColor = new Color3(1, 1, 1);
  materials.sprites.monster.emissiveColor = new Color3(1, 1, 1);
  materials.sprites.guy.disableLighting = true;
  materials.sprites.monster.disableLighting = true;

  return materials;
}
