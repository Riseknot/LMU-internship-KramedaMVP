import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { createUser, findOneUser } from "@/lib/services/user.service";



export async function POST(req: NextRequest) {
  try{
    await connectDB();
    const data = await req.json();

    const user = await createUser(data);

    return NextResponse.json(user);
  } catch (error){
    return NextResponse.json({ error: "Error creating user" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Query-Parameter aus URL
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email")?.trim() || undefined;
    const name = searchParams.get("name")?.trim() || undefined;

    if (!email && !name) {
      return NextResponse.json(
        { error: "Email or name must be provided" },
        { status: 400 }
      );
    }

    const query: any = {};
    if (email) query.email = email;
    if (name) query.name = name;

    const userData = await findOneUser(query);

    console.log(`🔍 GET /api/users?email=${email}&name=${name} - User found: ${!!userData}`);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}