import { NextResponse } from "next/server";
import { adminSupabase, supabase } from "@/lib/supabase";

const client = adminSupabase ?? supabase;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { data, error } = await client.from("invitations").insert([
            {
                registered_at: new Date().toLocaleDateString("fa-IR"),
                selected_date: body.selectedDate,
                food: body.food,
                time: body.time,
            },
        ]);

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ثبت در دیتابیس انجام نشد",
                    error,
                },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await client
            .from("invitations")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: "خواندن داده‌ها از دیتابیس انجام نشد",
                    error,
                },
                { status: 500 },
            );
        }

        return NextResponse.json({ entries: data ?? [] });
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
