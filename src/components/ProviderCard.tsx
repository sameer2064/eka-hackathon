import Link from "next/link";

export default function ProviderCard({
  provider,
}: any) {

  return (

    <Link href={`/providers/${provider.id}`}>

      <div className="glass rounded-[32px] p-7 card-hover">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div className="flex items-start gap-5">

            <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-3xl font-bold">

              {provider.full_name?.charAt(0)}

            </div>

            <div>

              <div className="flex items-center gap-3 mb-2">

                <h2 className="text-2xl font-semibold">

                  {provider.full_name}

                </h2>

                {provider.verified && (
                  <span className="text-blue-400 text-sm">
                    ✓ Verified
                  </span>
                )}

                <div className="status-online" />

              </div>

              <p className="text-zinc-400 mb-1">
                {provider.service_category}
              </p>

              <p className="text-zinc-500 text-sm">
                {provider.city}
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            {provider.featured && (
              <div className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-2xl text-sm">
                Featured
              </div>
            )}

            {provider.premium && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-2xl text-sm">
                Premium
              </div>
            )}

          </div>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

          <div className="bg-black rounded-[24px] p-5">

            <p className="text-zinc-500 text-sm mb-2">
              Trust
            </p>

            <h3 className="text-3xl font-semibold">
              {provider.trust_score || 0}
            </h3>

          </div>

          <div className="bg-black rounded-[24px] p-5">

            <p className="text-zinc-500 text-sm mb-2">
              AI
            </p>

            <h3 className="text-3xl font-semibold text-green-400">
              {provider.ai_score || 0}
            </h3>

          </div>

          <div className="bg-black rounded-[24px] p-5">

            <p className="text-zinc-500 text-sm mb-2">
              Rating
            </p>

            <h3 className="text-3xl font-semibold text-yellow-400">
              {provider.rating || 0}
            </h3>

          </div>

          <div className="bg-black rounded-[24px] p-5">

            <p className="text-zinc-500 text-sm mb-2">
              Bookings
            </p>

            <h3 className="text-3xl font-semibold">
              {provider.total_bookings || 0}
            </h3>

          </div>

        </div>

      </div>

    </Link>
  );
}