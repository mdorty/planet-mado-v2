import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../authOptions';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as any).isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { email, name, password, isAdmin } = body;
  const { id } = context.params;

  const updateData: any = {
    email,
    name,
    isAdmin,
  };

  if (password) {
    updateData.password = await hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as any).isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = context.params;

  await prisma.user.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
