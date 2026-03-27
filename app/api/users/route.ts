import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { createUser, findOneUser, updateUser } from "@/lib/services/user.service";


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

    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email")?.trim() || undefined;
    const firstname = searchParams.get("firstname")?.trim() || undefined;

    if (!email && !firstname) {
      return NextResponse.json(
        { error: "Email or firstname must be provided" },
        { status: 400 }
      );
    }

    const query: any = {};
    if (email) query.email = email;
    if (firstname) query.firstname = firstname;

    const userData = await findOneUser(query);

    console.log(`🔍 GET /api/users?email=${email}&firstname=${firstname} - User found: ${!!userData}`);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const { email } = await context.params;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await connectDB();
    const data = await req.json();
    await updateUser(email, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}