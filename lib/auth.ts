import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function auth(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.redirect('/login');
  }
  
  return NextResponse.next();
}
