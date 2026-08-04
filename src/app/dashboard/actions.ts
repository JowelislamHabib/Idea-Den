"use server";

import { MongoClient, ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getDb = async () => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  await client.connect();
  return client.db("IdeaDen");
};

const verifyAdmin = async (session: any = null) => {
  const s = session ?? (await auth.api.getSession({ headers: await headers() }));
  if (!s || s.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return s;
};

const getUserDoc = async (db: any, id: string) =>
  db.collection("user").findOne({ _id: new ObjectId(id) });

const isSelf = (doc: any, session: any) =>
  doc.id === session.user.id || doc._id.toString() === session.user.id;

/* ---------------------------------- Users --------------------------------- */

export async function deleteUser(id: string) {
  const session = await verifyAdmin();
  const db = await getDb();
  const doc = await getUserDoc(db, id);
  if (!doc) throw new Error("User not found");
  if (isSelf(doc, session)) throw new Error("You cannot delete your own account");
  await db.collection("user").deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/dashboard/users");
}

export async function banUser(id: string, banReason?: string) {
  const session = await verifyAdmin();
  const db = await getDb();
  const doc = await getUserDoc(db, id);
  if (!doc) throw new Error("User not found");
  if (isSelf(doc, session)) throw new Error("You cannot ban yourself");
  await auth.api.banUser({
    body: {
      userId: doc.id || doc._id.toString(),
      banReason: banReason || undefined,
    },
    headers: await headers(),
  });
  revalidatePath("/dashboard/users");
}

export async function unbanUser(id: string) {
  await verifyAdmin();
  const db = await getDb();
  const doc = await getUserDoc(db, id);
  if (!doc) throw new Error("User not found");
  await auth.api.unbanUser({
    body: { userId: doc.id || doc._id.toString() },
    headers: await headers(),
  });
  revalidatePath("/dashboard/users");
}

export async function setUserRole(id: string, role: "admin" | "pro" | "free") {
  const session = await verifyAdmin();
  const db = await getDb();
  const doc = await getUserDoc(db, id);
  if (!doc) throw new Error("User not found");
  if (isSelf(doc, session)) throw new Error("You cannot change your own role");
  if (doc.role === "admin" && role !== "admin")
    throw new Error("You cannot demote another admin");
  await db.collection("user").updateOne({ _id: new ObjectId(id) }, { $set: { role } });
  revalidatePath("/dashboard/users");
}

/* ---------------------------------- Ideas ---------------------------------- */

export async function createIdea(input: { title: string; description: string }) {
  const session = await verifyAdmin();
  const db = await getDb();
  await db.collection("ideas").insertOne({
    projectTitle: input.title,
    tagline: input.description,
    ownerId: session.user.id,
    visibility: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  revalidatePath("/dashboard/ideas");
  revalidatePath("/dashboard");
}

export async function updateIdea(
  id: string,
  input: { title: string; description: string }
) {
  await verifyAdmin();
  const db = await getDb();
  await db.collection("ideas").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        projectTitle: input.title,
        tagline: input.description,
        updatedAt: new Date(),
      },
    }
  );
  revalidatePath("/dashboard/ideas");
  revalidatePath("/dashboard");
}

export async function deleteIdea(id: string) {
  await verifyAdmin();
  const db = await getDb();
  await db.collection("ideas").deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/dashboard/ideas");
  revalidatePath("/dashboard");
}

/* ---------------------------------- Blogs ---------------------------------- */

export async function createBlog(input: { title: string }) {
  const session = await verifyAdmin();
  const db = await getDb();
  await db.collection("blogs").insertOne({
    title: input.title,
    topic: input.title,
    content: "",
    ownerId: session.user.id,
    visibility: "public",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  revalidatePath("/dashboard/blogs");
  revalidatePath("/dashboard");
}

export async function updateBlog(id: string, input: { title: string }) {
  await verifyAdmin();
  const db = await getDb();
  await db.collection("blogs").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: input.title,
        topic: input.title,
        updatedAt: new Date(),
      },
    }
  );
  revalidatePath("/dashboard/blogs");
  revalidatePath("/dashboard");
}

export async function deleteBlog(id: string) {
  await verifyAdmin();
  const db = await getDb();
  await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/dashboard/blogs");
  revalidatePath("/dashboard");
}