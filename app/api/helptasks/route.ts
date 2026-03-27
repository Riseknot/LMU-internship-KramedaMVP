import { connectDB } from "@/lib/connectDB";
import {
    createHelptask,
    findHelptasks,
    updateHelptaskById,
} from "@/lib/services/helptasks.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();

        // Parse ISO timestamps to Date and time strings
        const startDateTime = data.startTime ? new Date(data.startTime) : new Date();
        const endDateTime = data.endTime ? new Date(data.endTime) : new Date(startDateTime.getTime() + 3600000);

        const normalizedData = {
            taskType: data.taskType || 'help',
            title: data.title,
            description: data.description,
            location: data.location || { type: 'Point', coordinates: [0, 0] },
            address: data.address || { zipCode: '', city: '', street: '' },
            startDate: startDateTime,
            startTime: startDateTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            endDate: endDateTime,
            endTime: endDateTime.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
            status: data.status || 'open',
            firstname: data.firstname?.trim(),
            surname: data.surname?.trim(),
            email: data.email?.trim()?.toLowerCase(),
            createdBy: null, // Will be set by Mongoose schema
        };

        const helptask = await createHelptask(normalizedData as any);

        return NextResponse.json(helptask, { status: 201 });
    } catch (error) {
        console.error("POST /api/helptasks error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const firstname = searchParams.get("firstname")?.trim() || undefined;
        const surname = searchParams.get("surname")?.trim() || undefined;
        const email = searchParams.get("email")?.trim().toLowerCase() || undefined;
        const rawStatus = searchParams.get("status")?.trim();
        const status =
            rawStatus === "open" || rawStatus === "assigned" || rawStatus === "completed"
                ? rawStatus
                : undefined;
        const zipCode = searchParams.get("zipCode")?.trim() || undefined;
        const title = searchParams.get("title")?.trim() || undefined;

        const helptasks = await findHelptasks({ firstname, surname, email, status, zipCode, title });
        return NextResponse.json(helptasks);
    } catch (error) {
        console.error("Error fetching helptasks:", error);
        return NextResponse.json({ error: "Error fetching helptasks" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const idFromQuery = searchParams.get("id")?.trim();

        const body = await req.json();
        const id = (idFromQuery || body?.id || body?._id || "").trim();

        if (!id) {
            return NextResponse.json({ error: "Helptask id is required" }, { status: 400 });
        }

        const updateData: Record<string, unknown> = { ...body };
        delete updateData.id;
        delete updateData._id;
        delete updateData.createdBy;
        delete updateData.firstname;
        delete updateData.surname;
        delete updateData.email;
        delete updateData.createdAt;
        delete updateData.updatedAt;

        if (!Object.keys(updateData).length) {
            return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
        }

        const updatedHelptask = await updateHelptaskById(id, updateData);

        if (!updatedHelptask) {
            return NextResponse.json({ error: "Helptask not found" }, { status: 404 });
        }

        return NextResponse.json(updatedHelptask);
    } catch (error) {
        console.error("Error updating helptask:", error);
        return NextResponse.json({ error: "Error updating helptask" }, { status: 500 });
    }
}