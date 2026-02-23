import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { getAllOperators } from "@/lib/queries/operators";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const operators = await getAllOperators();
    return NextResponse.json(operators);
  } catch (error) {
    console.error("admin/operators error:", error);
    return NextResponse.json(
      { error: "Failed to fetch operators" },
      { status: 500 }
    );
  }
}
