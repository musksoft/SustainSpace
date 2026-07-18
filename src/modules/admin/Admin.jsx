export default function Admin() {
  return (
    <div>
      <h1
        className="
text-4xl
font-serif
text-[#16362D]
"
      >
        Admin Dashboard
      </h1>

      <p className="text-gray-500 mt-2">Manage SustainSpace ecosystem</p>

      {/* STAT CARDS */}

      <div
        className="
grid
md:grid-cols-4
gap-5
mt-8
"
      >
        {[
          ["Total Users", "1,256"],
          ["Active Listings", "482"],
          ["Pending Reports", "12"],
          ["Verified Sellers", "84"],
        ].map((item) => (
          <div
            className="
bg-white
border
rounded-2xl
p-6
"
          >
            <p className="text-gray-500 text-sm">{item[0]}</p>

            <h2
              className="
text-3xl
font-semibold
mt-3
text-[#16362D]
"
            >
              {item[1]}
            </h2>
          </div>
        ))}
      </div>

      {/* MANAGEMENT AREA */}

      <div
        className="
grid
lg:grid-cols-3
gap-6
mt-10
"
      >
        <div
          className="
bg-white
rounded-2xl
border
p-6
"
        >
          <h2 className="font-serif text-xl">Seller Verification</h2>

          <p className="text-gray-500 mt-3">07 pending applications</p>

          <button
            className="
mt-5
bg-[#16362D]
text-white
px-5
py-2
rounded-lg
"
          >
            Review
          </button>
        </div>

        <div
          className="
bg-white
rounded-2xl
border
p-6
"
        >
          <h2 className="font-serif text-xl">Listing Moderation</h2>

          <p className="text-gray-500 mt-3">12 reported listings</p>

          <button
            className="
mt-5
border
px-5
py-2
rounded-lg
"
          >
            View Reports
          </button>
        </div>

        <div
          className="
bg-white
rounded-2xl
border
p-6
"
        >
          <h2 className="font-serif text-xl">System Health</h2>

          <p
            className="
text-green-600
font-semibold
mt-3
"
          >
            99.9% uptime
          </p>
        </div>
      </div>

      {/* RECENT ACTIVITY */}

      <div
        className="
bg-white
rounded-2xl
border
mt-10
p-6
"
      >
        <h2
          className="
font-serif
text-2xl
mb-5
"
        >
          Recent Activity
        </h2>

        <div className="space-y-4">
          {[
            "New seller application submitted",
            "Listing reported for misleading image",
            "User account verified",
            "Transaction completed",
          ].map((x) => (
            <div
              className="
border-b
pb-3
text-gray-600
"
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
