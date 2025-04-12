import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as any).isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as any).isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await request.json();
  const { email, name, password, isAdmin } = body;

  if (!email || !password) {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new NextResponse('User already exists', { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    },
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
