import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { projects } from "../../../db/schema";

export async function GET() {
  try {
    const rows = await getDb().select().from(projects).orderBy(desc(projects.createdAt));
    return Response.json({ projects: rows });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json() as { title?: string; genre?: string };
  const title = body.title?.trim();
  if (!title) return Response.json({ error: "Title is required" }, { status: 400 });
  try {
    const [project] = await getDb().insert(projects).values({ title, genre: body.genre?.trim() || "Tunisian urban" }).returning();
    return Response.json({ project }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Database unavailable" }, { status: 500 });
  }
}
