import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/authOptions";

export async function GET() {
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

  const maps = await prisma.map.findMany({
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

  return NextResponse.json(maps);
}

export async function POST(request: Request) {
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

  const data = await request.json();

  const map = await prisma.map.create({
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

  return NextResponse.json(map);
}
