import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from "three";
import {
  RubikCube,
  rubikCubeFaceColorToHex,
  RubikCubeFaceName,
  RubikCubeFaceXIndex,
  RubikCubeFaceYIndex,
} from "./RubikCube/RubikCube";

export type CUBE_INFO = {
  position: [x: number, y: number, z: number];
  mapping: {
    flat: [
      face: RubikCubeFaceName,
      y: RubikCubeFaceYIndex,
      x: RubikCubeFaceXIndex,
    ];
    cubeFace: RubikCubeCubeFaceIndex;
  }[];
};

const CUBE_FACE_INDEX_MAP = {
  "RIGHT": 0,
  "LEFT": 1,
  "UP": 2,
  "DOWN": 3,
  "FRONT": 4,
  "BACK": 5,
} as const;
export type RubikCubeCubeFaceIndex =
  (typeof CUBE_FACE_INDEX_MAP)[keyof typeof CUBE_FACE_INDEX_MAP];

// deno-fmt-ignore
export const RUBIK_CUBE_CENTER_CUBE = [
  [
    "U",
    {
      position: [0, 1, 0],
      mapping: [{
        flat: ["U", 1, 1],
        cubeFace: CUBE_FACE_INDEX_MAP.UP
      }]
    }
  ], [
    "D",
    {
      position: [0, -1, 0],
      mapping: [{
        flat: ["D", 1, 1],
        cubeFace: CUBE_FACE_INDEX_MAP.DOWN
      }]
    },
  ], [
    "F",
    {
      position: [0, 0, 1],
      mapping: [{
        flat: ["F", 1, 1],
        cubeFace: CUBE_FACE_INDEX_MAP.FRONT
      }]
    }
  ], [
    "B",
    {
      position: [0, 0, -1],
      mapping: [{
        flat: ["B", 1, 1],
        cubeFace: CUBE_FACE_INDEX_MAP.BACK
      }]
    }
  ], [
    "L",
    {
      position: [-1, 0, 0],
      mapping: [{
        flat: ["L", 1, 1],
        cubeFace: CUBE_FACE_INDEX_MAP.LEFT
      }]
    }
  ], [
    "R",
    {
      position: [1, 0, 0],
      mapping: [{
        flat: ["R", 1, 1],
        cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
      }]
    }
  ],
] as const satisfies [string, CUBE_INFO][];
export type RubikCubeCenterCube = typeof RUBIK_CUBE_CENTER_CUBE[number][0];

// deno-fmt-ignore
export const RUBIK_CUBE_CORNER_CUBE = [
  [
    "UFR",
    {
      position: [1, 1, 1],
      mapping: [
        {
          flat: ["U", 2, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["F", 0, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }, {
          flat: ["R", 0, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }
      ]
    }
  ], [
    "UFL",
    {
      position: [-1, 1, 1],
      mapping: [
        {
          flat: ["U", 2, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["F", 0, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }, {
          flat: ["L", 0, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }
      ]
    }
  ],
  [
    "UBR",
    {
      position: [1, 1, -1],
      mapping: [
        {
          flat: ["U", 0, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["B", 0, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }, {
          flat: ["R", 0, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }
      ],
    }
  ],
  [
    "UBL",
    {
      position: [-1, 1, -1],
      mapping: [
        {
          flat: ["U", 0, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["B", 0, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }, {
          flat: ["L", 0, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }
      ]
    }
  ],
  [
    "DFR",
    {
      position: [1, -1, 1],
      mapping: [
        {
          flat: ["D", 0, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["F", 2, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }, {
          flat: ["R", 2, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }
      ]
    }
  ],
  [
    "DRB",
    {
      position: [1, -1, -1],
      mapping: [
        {
          flat: ["D", 2, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["R", 2, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }, {
          flat: ["B", 2, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }
      ]
    }
  ],
  [
    "DBL",
    {
      position: [-1, -1, -1],
      mapping: [
        {
          flat: ["D", 2, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["B", 2, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }, {
          flat: ["L", 2, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }
      ]
    }
  ],
  [
    "DLF",
    {
      position: [-1, -1, 1],
      mapping: [
        {
          flat: ["D", 0, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["L", 2, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }, {
          flat: ["F", 2, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }
      ]
    }
  ]
] as const satisfies [string, CUBE_INFO][];
export type RubikCubeCornerCube = typeof RUBIK_CUBE_CORNER_CUBE[number][0];

// deno-fmt-ignore
export const RUBIK_CUBE_EDGE_CUBE = [
  [
    "UF",
    {
      position: [0, 1, 1],
      mapping: [
        {
          flat: ["U", 2, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["F", 0, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }
      ]
    }
  ], 
  [
    "UR",
    {
      position: [1, 1, 0],
      mapping: [
        {
          flat: ["U", 1, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["R", 0, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }
      ]
    }
  ],
  [
    "UB",
    {
      position: [0, 1, -1],
      mapping: [
        {
          flat: ["U", 0, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["B", 0, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }
      ]
    }
  ],
  [
    "UL",
    {
      position: [-1, 1, 0],
      mapping: [
        {
          flat: ["U", 1, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.UP
        }, {
          flat: ["L", 0, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }
      ]
    }
  ],
  [
    "FR",
    {
      position: [1, 0, 1],
      mapping: [
        {
          flat: ["F", 1, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }, {
          flat: ["R", 1, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }
      ]
    }
  ],
  [
    "RB",
    {
      position: [1, 0, -1],
      mapping: [
        {
          flat: ["R", 1, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }, {
          flat: ["B", 1, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }
      ]
    }
  ],
  [
    "BL",
    {
      position: [-1, 0, -1],
      mapping: [
        {
          flat: ["B", 1, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }, {
          flat: ["L", 1, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }
      ]
    }
  ],
  [
    "LF",
    {
      position: [-1, 0, 1],
      mapping: [
        {
          flat: ["L", 1, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }, {
          flat: ["F", 1, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }
      ]
    }
  ],
  [
    "DF",
    {
      position: [0, -1, 1],
      mapping: [
        {
          flat: ["D", 0, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["F", 2, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.FRONT
        }
      ]
    }
  ],
  [
    "DR",
    {
      position: [1, -1, 0],
      mapping: [
        {
          flat: ["D", 1, 2],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["R", 2, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.RIGHT
        }
      ]
    }
  ],
  [
    "DB",
    {
      position: [0, -1, -1],
      mapping: [
        {
          flat: ["D", 2, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["B", 2, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.BACK
        }
      ]
    }
  ],
  [
    "DL",
    {
      position: [-1, -1, 0],
      mapping: [
        {
          flat: ["D", 1, 0],
          cubeFace: CUBE_FACE_INDEX_MAP.DOWN
        }, {
          flat: ["L", 2, 1],
          cubeFace: CUBE_FACE_INDEX_MAP.LEFT
        }
      ]
    }
  ],
] as const satisfies [string, CUBE_INFO][];
export type RubikCubeEdgeCube = typeof RUBIK_CUBE_EDGE_CUBE[number];

export type RubikCubeCube =
  | RubikCubeCenterCube
  | RubikCubeCornerCube
  | RubikCubeEdgeCube;

// deno-fmt-ignore
export const RUBIK_CUBE_CUBE_FACE_NAME = [
  "UP", "DOWN",
  "FRONT", "BACK",
  "LEFT", "RIGHT",
] as const;
export type RubikCubeCubeFace = typeof RUBIK_CUBE_CUBE_FACE_NAME[number];

export const RUBIK_CUBE_CUBE = [
  ...RUBIK_CUBE_CENTER_CUBE,
  ...RUBIK_CUBE_CORNER_CUBE,
  ...RUBIK_CUBE_EDGE_CUBE,
];

export const generateRubikCubeCubeModel = (rubikCubik: RubikCube) => {
  const group = new Group();

  for (const [_name, cubeInfo] of RUBIK_CUBE_CUBE) {
    const materials = [
      new MeshBasicMaterial({ color: 0x999999 }),
      new MeshBasicMaterial({ color: 0x999999 }),
      new MeshBasicMaterial({ color: 0x999999 }),
      new MeshBasicMaterial({ color: 0x999999 }),
      new MeshBasicMaterial({ color: 0x999999 }),
      new MeshBasicMaterial({ color: 0x999999 }),
    ];

    for (const { flat, cubeFace } of cubeInfo.mapping) {
      materials[cubeFace].color.setHex(
        rubikCubeFaceColorToHex(
          rubikCubik.cubeState[flat[0]][flat[1]][flat[2]],
        ),
      );
    }

    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      materials,
    );

    cube.position.set(
      cubeInfo.position[0],
      cubeInfo.position[1],
      cubeInfo.position[2],
    );
    group.add(cube);
  }

  return group;
};
