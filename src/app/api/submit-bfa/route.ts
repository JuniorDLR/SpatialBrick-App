import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  return NextResponse.json({
    ok: true,
    message: "Payload BFA recibido por el endpoint mock.",
    receivedAt: new Date().toISOString(),
    payload,
  });
}
