import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function pushSchema() {
  console.log("Connecting to Turso database...");
  console.log("URL:", process.env.TURSO_DATABASE_URL);
  
  // Create User table
  console.log("Creating User table...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "college" TEXT NOT NULL,
      "branch" TEXT NOT NULL,
      "semester" TEXT NOT NULL,
      "bio" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )
  `);
  console.log("User table created!");

  // Create User email index
  console.log("Creating User email index...");
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`);
  console.log("User email index created!");

  // Create Resource table
  console.log("Creating Resource table...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Resource" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "subject" TEXT NOT NULL,
      "semester" TEXT NOT NULL,
      "resourceType" TEXT NOT NULL,
      "yearBatch" TEXT NOT NULL,
      "tags" TEXT NOT NULL,
      "privacy" TEXT NOT NULL DEFAULT 'PUBLIC',
      "filePath" TEXT NOT NULL,
      "fileName" TEXT NOT NULL,
      "fileSize" INTEGER NOT NULL,
      "fileType" TEXT NOT NULL,
      "downloads" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "userId" TEXT NOT NULL,
      CONSTRAINT "Resource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log("Resource table created!");

  // Create Review table
  console.log("Creating Review table...");
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "Review" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "rating" INTEGER NOT NULL,
      "comment" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "userId" TEXT NOT NULL,
      "resourceId" TEXT NOT NULL,
      CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT "Review_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
  `);
  console.log("Review table created!");

  // Create Review unique index
  console.log("Creating Review unique index...");
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "Review_userId_resourceId_key" ON "Review"("userId", "resourceId")`);
  console.log("Review unique index created!");

  // Verify
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("\nTables in database:", result.rows);

  console.log("\nSchema pushed successfully!");
  process.exit(0);
}

pushSchema().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
