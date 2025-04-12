import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/authOptions";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const id = await Promise.resolve(params.id);
  const map = await prisma.map.findUnique({
    where: { id },
    include: {
      exits: true,
      tiles: {
        include: {
          interior: true,
          items: {
            include: {
              item: true,
            },
          },
        },
      },
    },
  });

  if (!map) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  return NextResponse.json(map);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const mapId = await Promise.resolve(params.id);
  const data = await request.json();

  const existingMap = await prisma.map.findUnique({
    where: { id: mapId },
  });

  if (!existingMap) {
    return NextResponse.json({ error: "Map not found" }, { status: 404 });
  }

  // Delete existing relations
  await prisma.itemOnTile.deleteMany({
    where: {
      mapTile: {
        mapId: mapId,
      },
    },
  });

  await prisma.buildingInterior.deleteMany({
    where: {
      mapTile: {
        mapId: mapId,
      },
    },
  });

  await prisma.mapTile.deleteMany({
    where: {
      mapId: mapId,
    },
  });

  await prisma.mapExit.deleteMany({
    where: {
      mapId: mapId,
    },
  });

  const updatedMap = await prisma.map.update({
    where: { id: mapId },
    data: {
      name: data.name,
      gravityMultiplier: data.gravityMultiplier,
      exits: {
        create: data.exits,
      },
      tiles: {
        create: data.tiles.map((tile: any) => ({
          x: tile.x,
          y: tile.y,
          tileType: tile.tileType,
          description: tile.description,
          image: tile.image,
          isBuilding: tile.isBuilding,
          buildingId: tile.buildingId,
          interior: tile.interior
            ? {
                create: {
                  x: tile.interior.x,
                  y: tile.interior.y,
                  tileType: tile.interior.tileType,
                  image: tile.interior.image,
                  isExitTile: tile.interior.isExitTile,
                },
              }
            : undefined,
          items: {
            create: tile.items?.map((item: any) => ({
              quantity: item.quantity,
              condition: item.condition,
              item: {
                connect: {
                  id: item.itemId,
                },
              },
            })),
          },
        })),
      },
    },
    include: {
      exits: true,
      tiles: {
        include: {
          interior: true,
          items: {
            include: {
              item: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(updatedMap);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Delete map and all related data (cascading deletes will handle relations)
  await prisma.map.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
