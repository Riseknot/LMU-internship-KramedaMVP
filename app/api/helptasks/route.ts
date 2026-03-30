import { connectDB } from "@/lib/connectDB";
import {
    createHelptask,
    findHelptasks,
    updateHelptaskById,
} from "@/lib/services/helptasks.service";
import { NextRequest, NextResponse } from "next/server";

function parseIsoDate(value: unknown): Date | null {
    if (typeof value !== "string") {
        return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();

        const rawStart = data.start;
        const rawEnd = data.end;

        if (!rawStart || !rawEnd) {
            return NextResponse.json(
                { error: "start and end are required ISO datetime values" },
                { status: 400 }
            );
        }

        const startDate = parseIsoDate(rawStart);
        const endDate = parseIsoDate(rawEnd);

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: "start and end must be valid ISO datetime values" },
                { status: 400 }
            );
        }

        const normalizedData = {
            taskType: data.taskType || 'help',
            title: data.title,
            description: data.description,
            location: data.location?.type === 'Point' && Array.isArray(data.location?.coordinates)
                ? data.location
                : { type: 'Point', coordinates: [0, 0] },
            address: data.address || { zipCode: '', city: '', street: '' },
            start: startDate,
            end: endDate,
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