/* eslint-disable no-param-reassign */
import { Color3, StandardMaterial } from '@babylonjs/core';
import createTextures from './textures';

interface Materials {
  enviroment: {
    red: StandardMaterial,
    ground: StandardMaterial,
    wall: StandardMaterial,
  },
  sprites: {
    guy: StandardMaterial,
    monster: StandardMaterial,
  },
  animations: {
    elder: {
      idle: StandardMaterial
    },
  },
  trees: {
    bluberry: [
      StandardMaterial,
      StandardMaterial,
      StandardMaterial,
      StandardMaterial,
    ]
  },
  floor: {
    forest: [
      StandardMaterial
    ]
  }
}

/**
 * 
 * @returns {{trees.bluberry[]}}
 */
export default function createMaterials(scene) {
  const textures = createTextures(scene);
  const materials: Materials = {
    enviroment: {
      red: new StandardMaterial('redMat', scene),
      wall: new StandardMaterial('wallMat', scene),
      ground: new StandardMaterial('groundMat', scene),
    },
    sprites: {
      guy: new StandardMaterial('guyMat', scene),
      monster: new StandardMaterial('monsterMat', scene),
    },
    animations: {
      elder: {
        idle: new StandardMaterial('elderIdleMat', scene),
      },
    },
    trees: {
      bluberry: [
        new StandardMaterial('trees0', scene),
        new StandardMaterial('trees1', scene),
        new StandardMaterial('trees2', scene),
        new StandardMaterial('trees3', scene),
      ],
    },
    floor:{
      forest: [
        new StandardMaterial('grass', scene),
      ],
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

  materials.animations.elder.idle.diffuseTexture = textures.animations.elder.idle;
  materials.animations.elder.idle.diffuseTexture.hasAlpha = true;
  materials.animations.elder.idle.emissiveColor = new Color3(1, 1, 1);
  materials.animations.elder.idle.disableLighting = true;

  materials.trees.bluberry.forEach((el, i) => {
    el.diffuseTexture = textures.trees.bluberry[i];
    el.diffuseTexture.hasAlpha = true;
    el.emissiveColor = new Color3(1, 1, 1);
    el.disableLighting = true;
  });

  // eslint-disable-next-line prefer-destructuring
  materials.floor.forest[0].diffuseTexture = textures.floor.forest[0];
  materials.floor.forest[0].disableLighting = true;
  materials.floor.forest[0].emissiveColor = new Color3(1, 1, 1);

  return materials;
}
