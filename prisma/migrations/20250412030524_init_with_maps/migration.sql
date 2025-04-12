-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "planet" TEXT,
    "alignment" INTEGER NOT NULL DEFAULT 0,
    "basePowerlevel" INTEGER NOT NULL,
    "currentPowerlevel" INTEGER NOT NULL,
    "hiddenPowerlevel" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastDeath" TIMESTAMP(3),
    "deathCount" INTEGER NOT NULL DEFAULT 0,
    "lastDateTrained" TIMESTAMP(3),
    "lastDateMeditated" TIMESTAMP(3),
    "peopleMet" TEXT,
    "jobs" TEXT,
    "abilityCount" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Map" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gravityMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapExit" (
    "id" TEXT NOT NULL,
    "exitX" INTEGER NOT NULL,
    "exitY" INTEGER NOT NULL,
    "entryX" INTEGER NOT NULL,
    "entryY" INTEGER NOT NULL,
    "destinationMap" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "MapExit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapTile" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "tileType" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "isBuilding" BOOLEAN NOT NULL DEFAULT false,
    "buildingId" TEXT,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "MapTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuildingInterior" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "tileType" TEXT NOT NULL,
    "image" TEXT,
    "isExitTile" BOOLEAN NOT NULL DEFAULT false,
    "mapTileId" TEXT NOT NULL,

    CONSTRAINT "BuildingInterior_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "condition" INTEGER,
    "equipped" BOOLEAN NOT NULL DEFAULT false,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOnTile" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" INTEGER NOT NULL DEFAULT 100,
    "itemId" TEXT NOT NULL,
    "mapTileId" TEXT NOT NULL,

    CONSTRAINT "ItemOnTile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "percentDamage" INTEGER,
    "percentCost" INTEGER,
    "isChargeable" BOOLEAN NOT NULL DEFAULT false,
    "isStun" BOOLEAN NOT NULL DEFAULT false,
    "stunTurns" INTEGER,
    "stunChancePercent" INTEGER,
    "powerlevelMultiplier" DOUBLE PRECISION,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeightedClothing" (
    "id" TEXT NOT NULL,
    "bonusPercent" DOUBLE PRECISION NOT NULL,
    "characterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeightedClothing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Map_name_key" ON "Map"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MapTile_mapId_x_y_key" ON "MapTile"("mapId", "x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "BuildingInterior_mapTileId_key" ON "BuildingInterior"("mapTileId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemOnTile_itemId_mapTileId_key" ON "ItemOnTile"("itemId", "mapTileId");

-- CreateIndex
CREATE UNIQUE INDEX "WeightedClothing_characterId_key" ON "WeightedClothing"("characterId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapExit" ADD CONSTRAINT "MapExit_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapTile" ADD CONSTRAINT "MapTile_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildingInterior" ADD CONSTRAINT "BuildingInterior_mapTileId_fkey" FOREIGN KEY ("mapTileId") REFERENCES "MapTile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOnTile" ADD CONSTRAINT "ItemOnTile_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOnTile" ADD CONSTRAINT "ItemOnTile_mapTileId_fkey" FOREIGN KEY ("mapTileId") REFERENCES "MapTile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attack" ADD CONSTRAINT "Attack_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeightedClothing" ADD CONSTRAINT "WeightedClothing_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
