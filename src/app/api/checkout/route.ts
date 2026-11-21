import { NextResponse } from "next/server";
import { getStudent, priceIdr } from "@/lib/student";
import { createAdmin } from "@/lib/supabase/admin";

export async function POST() {
  const s = await getStudent();
  if (!s.user) return NextResponse.json({ login: true });
  if (s.isMember) return NextResponse.json({ error: "Akunmu sudah Premium." });
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) return NextResponse.json({ error: "Pembayaran belum disambungkan." }, { status: 503 });

  const amount = priceIdr();
  const orderId = `DA-${Date.now()}-${s.user.id.slice(0, 8)}`;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  await createAdmin().from("orders").insert({ id: orderId, user_id: s.user.id, amount, status: "pending" });

  const base = process.env.MIDTRANS_IS_PRODUCTION === "true" ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
  const r = await fetch(`${base}/snap/v1/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Basic " + Buffer.from(key + ":").toString("base64") },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: amount },
      item_details: [{ id: "premium", price: amount, quantity: 1, name: "Deta Academy Premium" }],
      customer_details: { email: s.user.email, first_name: s.name || undefined },
      callbacks: { finish: `${site}/bayar/selesai` },
    }),
  });
  const j = await r.json();
  if (!r.ok || !j.redirect_url) return NextResponse.json({ error: "Pembayaran belum bisa dibuat. Coba lagi sebentar." }, { status: 502 });
  return NextResponse.json({ redirect_url: j.redirect_url });
}
