import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";
import prisma from "../../../../../lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: { user: { select: { college: true } } },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    if (resource.privacy === "PRIVATE") {
      const userCollege = (session.user as any).college;
      if (resource.user.college !== userCollege) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (resource.userId === (session.user as any).id) {
      return NextResponse.json(
        { error: "You cannot review your own resource" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const review = await prisma.review.upsert({
      where: {
        userId_resourceId: {
          userId: (session.user as any).id,
          resourceId: params.id,
        },
      },
      update: {
        rating: parseInt(rating, 10),
        comment: comment || null,
      },
      create: {
        rating: parseInt(rating, 10),
        comment: comment || null,
        userId: (session.user as any).id,
        resourceId: params.id,
      },
      include: {
        user: { select: { id: true, name: true, college: true } },
      },
    });

    return NextResponse.json({ message: "Review submitted", review });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
