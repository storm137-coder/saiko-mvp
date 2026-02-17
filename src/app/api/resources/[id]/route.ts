import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            college: true,
            branch: true,
            semester: true,
          },
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, college: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    if (resource.privacy === "PRIVATE") {
      const userCollege = (session?.user as any)?.college;
      if (!userCollege || resource.user.college !== userCollege) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const reviewCount = resource.reviews.length;
    const averageRating =
      reviewCount > 0
        ? resource.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;

    return NextResponse.json({
      ...resource,
      reviewCount,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  } catch (error) {
    console.error("Resource detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
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
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    if (resource.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      subject,
      semester,
      resourceType,
      yearBatch,
      tags,
      description,
      privacy,
    } = body;

    if (
      !title ||
      !subject ||
      !semester ||
      !resourceType ||
      !yearBatch ||
      !tags
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 },
      );
    }

    const updated = await prisma.resource.update({
      where: { id: params.id },
      data: {
        title,
        subject,
        semester,
        resourceType,
        yearBatch,
        tags,
        description: description || null,
        privacy: privacy === "PRIVATE" ? "PRIVATE" : "PUBLIC",
      },
    });

    return NextResponse.json({
      message: "Resource updated",
      resource: updated,
    });
  } catch (error) {
    console.error("Resource update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resource = await prisma.resource.findUnique({
      where: { id: params.id },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    if (resource.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.resource.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Resource deleted" });
  } catch (error) {
    console.error("Resource delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
