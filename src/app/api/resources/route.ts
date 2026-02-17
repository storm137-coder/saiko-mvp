import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@prisma/client";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const subject = searchParams.get("subject") || "";
    const semester = searchParams.get("semester") || "";
    const resourceType = searchParams.get("resourceType") || "";
    const branch = searchParams.get("branch") || "";
    const yearBatch = searchParams.get("yearBatch") || "";
    const privacy = searchParams.get("privacy") || "";
    const sort = searchParams.get("sort") || "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "12", 10));

    const andConditions: any[] = [];

    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search } },
          { subject: { contains: search } },
          { tags: { contains: search } },
        ],
      });
    }

    if (subject) andConditions.push({ subject });
    if (semester) andConditions.push({ semester });
    if (resourceType) andConditions.push({ resourceType });
    if (yearBatch) andConditions.push({ yearBatch });
    if (branch) andConditions.push({ user: { branch } });

    const userCollege = (session?.user as any)?.college;

    if (privacy === "PUBLIC") {
      andConditions.push({ privacy: "PUBLIC" });
    } else if (privacy === "PRIVATE") {
      if (!userCollege) {
        return NextResponse.json({ resources: [], total: 0, totalPages: 1 });
      }
      andConditions.push({
        privacy: "PRIVATE",
        user: { college: userCollege },
      });
    } else if (userCollege) {
      andConditions.push({
        OR: [
          { privacy: "PUBLIC" },
          { privacy: "PRIVATE", user: { college: userCollege } },
        ],
      });
    } else {
      andConditions.push({ privacy: "PUBLIC" });
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    const total = await prisma.resource.count({ where });

    const orderBy: Prisma.ResourceOrderByWithRelationInput = {
      createdAt:
        sort === "oldest" ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
    };

    const resources = await prisma.resource.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { select: { id: true, name: true, college: true, branch: true } },
        reviews: { select: { rating: true } },
      },
    });

    const enriched = resources.map((resource) => {
      const reviewCount = resource.reviews.length;
      const averageRating =
        reviewCount > 0
          ? resource.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

      return {
        ...resource,
        reviewCount,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    });

    if (sort === "rating") {
      enriched.sort((a, b) => b.averageRating - a.averageRating);
    }

    return NextResponse.json({
      resources: enriched,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("Resources list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
