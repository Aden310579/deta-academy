import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdmin } from "@/lib/supabase/admin";

/** Notifikasi pembayaran dari Midtrans (Payment Notification URL: https://domainmu/api/midtrans). */
export async function POST(request: Request) {
  const n = await request.json();
  const key = process.env.MIDTRANS_SERVER_KEY || "";
  const expected = crypto.createHash("sha512").update(n.order_id + n.status_code + n.gross_amount + key).digest("hex");
  if (!key || expected !== n.signature_key) return NextResponse.json({ ok: false }, { status: 403 });

  const db = createAdmin();
  const { data: order } = await db.from("orders").select("*").eq("id", n.order_id).maybeSingle();
  if (!order) return NextResponse.json({ ok: true });

  const paid = n.transaction_status === "settlement" || (n.transaction_status === "capture" && n.fraud_status === "accept");
  const failed = ["deny", "cancel", "expire", "failure"].includes(n.transaction_status);
  const status = paid ? "paid" : failed ? n.transaction_status : "pending";
  await db.from("orders").update({ status, raw: n, updated_at: new Date().toISOString() }).eq("id", n.order_id);

  if (paid && order.status !== "paid" && order.user_id && Math.round(+n.gross_amount) === order.amount) {
    const days = parseInt(process.env.MEMBERSHIP_DAYS || "0", 10);
    const until = days > 0 ? new Date(Date.now() + days * 864e5) : new Date("2099-12-31T00:00:00Z");
    await db.from("profiles").update({ member_until: until.toISOString() }).eq("id", order.user_id);
  }
  return NextResponse.json({ ok: true });
}
