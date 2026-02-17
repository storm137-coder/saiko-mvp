import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../../../lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const subject = formData.get("subject") as string;
    const semester = formData.get("semester") as string;
    const resourceType = formData.get("resourceType") as string;
    const yearBatch = formData.get("yearBatch") as string;
    const tags = formData.get("tags") as string;
    const description = formData.get("description") as string;
    const privacy = formData.get("privacy") as string;

    if (
      !file ||
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

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Allowed: PDF, DOCX, PPT, Images" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name);
    const uniqueName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || null,
        subject,
        semester,
        resourceType,
        yearBatch,
        tags,
        privacy: privacy === "PRIVATE" ? "PRIVATE" : "PUBLIC",
        filePath: `/uploads/${uniqueName}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: (session.user as any).id,
      },
    });

    return NextResponse.json(
      { message: "Resource uploaded successfully", resource },
      { status: 201 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
