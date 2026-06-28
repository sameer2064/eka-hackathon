import { supabase } from "@/lib/supabase";

export async function createNotification({
  userId,
  actorId,
  bookingId,
  title,
  content,
  type = "system",
}: {
  userId: string | null | undefined;
  actorId?: string | null;
  bookingId?: string | null;
  title: string;
  content: string;
  type?: string;
}) {
  if (!userId) return;

  await supabase.from("notifications").insert({
    user_id: userId,
    actor_id: actorId || null,
    booking_id: bookingId || null,
    title,
    content,
    type,
    is_read: false,
  });
}

export async function creditCashbackOnce(booking: any) {
  const customerId = booking.customer_id || booking.user_id;

  if (!customerId || !booking.id) return;

  const { data: existing } = await supabase
    .from("wallet_transactions")
    .select("id")
    .eq("booking_id", booking.id)
    .eq("type", "cashback")
    .maybeSingle();

  if (existing) return;

  await supabase.from("wallet_transactions").insert({
    user_id: customerId,
    booking_id: booking.id,
    amount: Number(booking.cashback_amount || 0),
    type: "cashback",
    status: "credited",
  });

  await supabase
    .from("bookings")
    .update({ cashback_status: "credited" })
    .eq("id", booking.id);
}