import { Texture } from '@babylonjs/core';
import CobleDiff from './assets/textures/cobblestone/cobblestone_diff.jpg';
import CobleBump from './assets/textures/cobblestone/cobblestone_Bump.jpg';
import CobleNor from './assets/textures/cobblestone/cobblestone_Nor.jpg';
import CobleSpec from './assets/textures/cobblestone/cobblestone_Spec.jpg';

import BlockDiff from './assets/textures/blockwall/blockwall_diff.jpg';
import BlockNor from './assets/textures/blockwall/blockwall_Nor.jpg';
import BlockAO from './assets/textures/blockwall/blockwall_ao.jpg';

import char1 from './assets/textures/dungeonset/char1.png';
import floorBig from './assets/textures/dungeonset/floor-big.png';
import floorBig1 from './assets/textures/dungeonset/floor-big1.png';
import floor from './assets/textures/dungeonset/floor.png';
import monster1 from './assets/textures/dungeonset/monster1.png';
import wall1 from './assets/textures/dungeonset/wall1.png';

import elderIdle from './assets/animations/Elder.png';

import tree0 from './assets/textures/selfmade/tree0.png';
import tree1 from './assets/textures/selfmade/tree1.png';
import tree2 from './assets/textures/selfmade/tree2.png';
import tree3 from './assets/textures/selfmade/tree3.png';

export default function createTextures(scene) {
  let textures: {
    cobblestone: {
      diff: Texture,
      buff: Texture,
      spec: Texture,
      norm: Texture,
    },
    blockwall: {
      diff: Texture,
      norm: Texture,
      ao: Texture,
    },
    dungeonset: {
      char1: Texture,
      floorBig: Texture,
      floorBig1: Texture,
      floor: Texture,
      monster1: Texture,
      wall1: Texture,
    },
    animations: {
      elder: {
        idle: Texture,
      },
    },
    trees: {
      bluberry: [
        Texture,
        Texture,
        Texture,
        Texture,
      ]
    }
  };
  // eslint-disable-next-line prefer-const
  textures = {
    cobblestone: {
      diff: new Texture(CobleDiff, scene),
      buff: new Texture(CobleBump, scene),
      spec: new Texture(CobleSpec, scene),
      norm: new Texture(CobleNor, scene),
    },
    blockwall: {
      diff: new Texture(
        BlockDiff,
        scene,
        false,
        false,
        Texture.NEAREST_SAMPLINGMODE,
      ),
      norm: new Texture(BlockNor, scene),
      ao: new Texture(BlockAO, scene),
    },
    dungeonset: {
      char1: new Texture(
        char1,
        scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE,
      ),
      floorBig: new Texture(
        floorBig,
        scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE,
      ),
      floorBig1: new Texture(
        floorBig1,
        scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE,
      ),
      floor: new Texture(
        floor,
        scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE,
      ),
      monster1: new Texture(
        monster1,
        scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE,
      ),
      wall1: new Texture(
        wall1,
        scene,
        false,
        true,
        Texture.NEAREST_SAMPLINGMODE,
      ),
    },
    animations: {
      elder: {
        idle: new Texture(
          elderIdle,
          scene,
          false,
          true,
          Texture.NEAREST_SAMPLINGMODE,
        ),
      },
    },
    trees: {
      bluberry: [
        new Texture(
          tree0,
          scene,
          false,
          true,
          Texture.NEAREST_SAMPLINGMODE,
        ),
        new Texture(
          tree1,
          scene,
          false,
          true,
          Texture.NEAREST_SAMPLINGMODE,
        ),
        new Texture(
          tree2,
          scene,
          false,
          true,
          Texture.NEAREST_SAMPLINGMODE,
        ),
        new Texture(
          tree3,
          scene,
          false,
          true,
          Texture.NEAREST_SAMPLINGMODE,
        ),
      ],
    },
  };

  textures.dungeonset.wall1.uScale = 12.5;
  textures.dungeonset.wall1.vScale = 1.25;

  textures.cobblestone.diff.uScale = 1000;
  textures.cobblestone.diff.vScale = 1000;
  textures.cobblestone.spec.uScale = 1000;
  textures.cobblestone.spec.vScale = 1000;
  textures.cobblestone.norm.uScale = 1000;
  textures.cobblestone.norm.vScale = 1000;

  textures.blockwall.diff.uScale = 40;
  textures.blockwall.diff.vScale = 4;
  textures.blockwall.norm.uScale = 40;
  textures.blockwall.norm.vScale = 4;

  textures.animations.elder.idle.uScale = 0.5;
  textures.animations.elder.idle.vScale = 0.5;

  return textures;
}
