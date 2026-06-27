"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function ProviderPage() {

  const params = useParams();

  const [provider, setProvider] =
    useState<any>(null);

  const [reviews, setReviews] =
    useState<any[]>([]);

  const [bookingName, setBookingName] =
    useState("");

  const [bookingPhone, setBookingPhone] =
    useState("");

  const [bookingDetails, setBookingDetails] =
    useState("");

  const [reviewText, setReviewText] =
    useState("");

  const [reviewRating, setReviewRating] =
    useState(5);

  useEffect(() => {

    if (params?.id) {
      loadProvider();
      loadReviews();
      increaseViews();
    }

  }, [params]);

  async function increaseViews() {

    if (!params?.id) return;

    const { data } = await supabase
      .from("providers")
      .select("total_views")
      .eq("id", params.id)
      .single();

    await supabase
      .from("providers")
      .update({
        total_views:
          (data?.total_views || 0) + 1,
      })
      .eq("id", params.id);
  }

  async function loadProvider() {

    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("id", params.id)
      .single();

    setProvider(data);
  }

  async function loadReviews() {

    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("provider_id", params.id)
      .order("created_at", {
        ascending: false,
      });

    setReviews(data || []);
  }

  async function createBooking() {

    if (
      !bookingName ||
      !bookingPhone ||
      !bookingDetails
    ) {
      alert("Fill all fields");
      return;
    }

    await supabase
      .from("bookings")
      .insert([
        {
          provider_id: params.id,
          customer_name: bookingName,
          customer_phone: bookingPhone,
          message: bookingDetails,
          status: "pending",
        },
      ]);

    alert("Booking sent successfully");

    setBookingName("");
    setBookingPhone("");
    setBookingDetails("");
  }

  async function submitReview() {

    if (!reviewText) {
      alert("Write review");
      return;
    }

    await supabase
      .from("reviews")
      .insert([
        {
          provider_id: params.id,
          user_name: "Customer",
          rating: reviewRating,
          review: reviewText,
        },
      ]);

    alert("Review submitted");

    setReviewText("");

    loadReviews();
  }

  if (!provider) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center text-4xl font-black">

        Loading Provider...

      </main>

    );
  }

  return (

    <main className="min-h-screen bg-black text-white">

      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">

            <div className="glass rounded-[40px] p-10 mb-8 border border-white/5">

              <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">

                <div className="flex items-center gap-6">

                  <img
                    src={
                      provider.profile_image ||
                      "https://placehold.co/300x300"
                    }
                    className="w-32 h-32 rounded-[36px] object-cover border border-white/10"
                  />

                  <div>

                    <div className="flex flex-wrap items-center gap-3 mb-4">

                      <h1 className="text-5xl font-black">
                        {provider.full_name}
                      </h1>

                      {provider.verified && (
                        <div className="bg-blue-500 px-4 py-2 rounded-full text-sm font-black">
                          VERIFIED
                        </div>
                      )}

                      {provider.premium && (
                        <div className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-black">
                          PREMIUM
                        </div>
                      )}

                    </div>

                    <p className="text-2xl text-zinc-300 mb-3">
                      {provider.service_category}
                    </p>

                    <p className="text-zinc-500 text-lg">
                      📍 {provider.city}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <div className="live-dot" />

                  <p className="text-green-400 font-semibold">
                    Online Now
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-10">

                <div className="stats-card">

                  <p className="stats-label">
                    AI
                  </p>

                  <h3 className="stats-value text-green-400">
                    {provider.ai_score || 0}
                  </h3>

                </div>

                <div className="stats-card">

                  <p className="stats-label">
                    Trust
                  </p>

                  <h3 className="stats-value">
                    {provider.trust_score || 0}
                  </h3>

                </div>

                <div className="stats-card">

                  <p className="stats-label">
                    Rating
                  </p>

                  <h3 className="stats-value text-yellow-400">
                    {provider.rating || 0}
                  </h3>

                </div>

                <div className="stats-card">

                  <p className="stats-label">
                    Bookings
                  </p>

                  <h3 className="stats-value">
                    {provider.total_bookings || 0}
                  </h3>

                </div>

                <div className="stats-card">

                  <p className="stats-label">
                    Views
                  </p>

                  <h3 className="stats-value">
                    {provider.total_views || 0}
                  </h3>

                </div>

              </div>

            </div>

            <div className="glass rounded-[40px] p-10 mb-8">

              <h2 className="text-4xl font-black mb-8">
                About Provider
              </h2>

              <p className="text-zinc-300 text-xl leading-relaxed">

                {provider.bio ||
                  "Professional service provider on EKA marketplace."}

              </p>

            </div>

            <div className="glass rounded-[40px] p-10">

              <h2 className="text-4xl font-black mb-8">
                Reviews
              </h2>

              <div className="space-y-6 mb-10">

                {reviews.map((review) => (

                  <div
                    key={review.id}
                    className="bg-black rounded-[32px] p-6 border border-white/5"
                  >

                    <div className="flex items-center justify-between mb-5">

                      <h3 className="text-2xl font-black">
                        {review.user_name}
                      </h3>

                      <div className="text-yellow-400 font-bold">
                        ★ {review.rating}
                      </div>

                    </div>

                    <p className="text-zinc-300 leading-relaxed text-lg">
                      {review.review}
                    </p>

                  </div>

                ))}

              </div>

              <div className="space-y-4">

                <textarea
                  value={reviewText}
                  onChange={(e) =>
                    setReviewText(e.target.value)
                  }
                  placeholder="Write review..."
                  className="input-primary h-40"
                />

                <select
                  value={reviewRating}
                  onChange={(e) =>
                    setReviewRating(
                      Number(e.target.value)
                    )
                  }
                  className="input-primary"
                >

                  <option value={5}>
                    5 Stars
                  </option>

                  <option value={4}>
                    4 Stars
                  </option>

                  <option value={3}>
                    3 Stars
                  </option>

                  <option value={2}>
                    2 Stars
                  </option>

                  <option value={1}>
                    1 Star
                  </option>

                </select>

                <button
                  onClick={submitReview}
                  className="button-primary w-full"
                >
                  Submit Review
                </button>

              </div>

            </div>

          </div>

          <div>

            <div className="glass rounded-[40px] p-8 sticky top-28 border border-red-500/10">

              <h2 className="text-4xl font-black mb-8">
                Book Provider
              </h2>

              <div className="space-y-5">

                <input
                  placeholder="Your Name"
                  value={bookingName}
                  onChange={(e) =>
                    setBookingName(e.target.value)
                  }
                  className="input-primary"
                />

                <input
                  placeholder="Phone Number"
                  value={bookingPhone}
                  onChange={(e) =>
                    setBookingPhone(e.target.value)
                  }
                  className="input-primary"
                />

                <textarea
                  placeholder="Describe your work..."
                  value={bookingDetails}
                  onChange={(e) =>
                    setBookingDetails(e.target.value)
                  }
                  className="input-primary h-40"
                />

                <button
                  onClick={createBooking}
                  className="button-primary w-full"
                >
                  Send Booking
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}