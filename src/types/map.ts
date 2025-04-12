export interface Tile {
  id?: string;
  x: number;
  y: number;
  tileType: TileType;
  description?: string;
  image?: string;
  isBuilding: boolean;
  buildingId?: string;
  interior?: BuildingInterior;
  items?: ItemOnTile[];
}

export interface BuildingInterior {
  id?: string;
  x: number;
  y: number;
  tileType: TileType;
  image?: string;
  isExitTile: boolean;
}

export interface ItemOnTile {
  id?: string;
  quantity: number;
  condition: number;
  itemId: string;
  item?: Item;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  type: string;
  image?: string;
  condition?: number;
  equipped: boolean;
}

export interface MapExit {
  id?: string;
  exitX: number;
  exitY: number;
  entryX: number;
  entryY: number;
  destinationMap: string;
}

export interface GameMap {
  id?: string;
  name: string;
  gravityMultiplier: number;
  exits: MapExit[];
  tiles: Tile[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type TileType = 
  | "grass"
  | "forest"
  | "beach"
  | "water"
  | "mountain"
  | "town"
  | "road"
  | "snake way"
  | "building"
  | "desert"
  | "plains"
  | "cave"
  | "sky"
  | "blank";
