import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { supabase } from "../../config/supabaseClient";
import { Search } from "lucide-react";


export default function SystemActivity() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");


  useEffect(() => {
    loadActivities();
  }, []);



  async function loadActivities() {

    setLoading(true);


    const { data, error } = await supabase
      .from("system_activity")
      .select(`
        *,
        user:profiles(
          id,
          full_name,
          email
        ),
        admin:admins(
          id,
          full_name,
          email
        )
      `)
      .order("created_at", {
        ascending:false
      });



    if(error){

      console.error(
        "Activity error:",
        error
      );

      setLoading(false);

      return;
    }


    setActivities(data || []);

    setLoading(false);

  }




  const filteredActivities = activities.filter((activity)=>{


    const searchText = (

      activity.action +
      activity.entity_type +
      activity.description +
      activity.user?.full_name +
      activity.admin?.full_name

    )
    .toLowerCase();



    const matchesSearch =
      searchText.includes(
        search.toLowerCase()
      );



    const matchesFilter =
      filter === "all"
      ||
      activity.entity_type === filter;



    return matchesSearch && matchesFilter;


  });




  function getActionStyle(action){


    if(action?.includes("CREATED"))
      return "bg-green-100 text-green-700";


    if(action?.includes("COMPLETED"))
      return "bg-emerald-100 text-emerald-700";


    if(action?.includes("CANCELLED"))
      return "bg-red-100 text-red-700";


    if(action?.includes("UPDATED"))
      return "bg-blue-100 text-blue-700";


    return "bg-gray-100 text-gray-700";

  }





  return (

    <div className="min-h-screen flex bg-[#FAF7F2]">


      <AdminSidebar />



      <main className="flex-1 p-8 overflow-hidden flex flex-col">



        {/* HEADER */}

        <div className="mb-8 flex justify-between items-center">


          <div>

            <p className="text-[#8B5E3C] font-semibold tracking-wider text-sm">

              ADMIN PANEL

            </p>


            <h1 className="text-3xl font-serif text-[#1F3D2A]">

              System Activity

            </h1>


            <p className="text-gray-500 mt-1">

              Monitor important marketplace events.

            </p>

          </div>




          <div className="bg-white border rounded-xl px-6 py-4">

            <p className="text-xs text-gray-500">

              Total Events

            </p>


            <h2 className="text-2xl font-bold text-[#1F3D2A]">

              {activities.length}

            </h2>


          </div>



        </div>





        {/* SEARCH + FILTER */}


        <div className="bg-white rounded-2xl border p-5 mb-6">


          <div className="flex gap-4">


            <div className="relative flex-1">


              <Search

                size={18}

                className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                "

              />


              <input

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                placeholder="Search activity..."

                className="
                w-full
                pl-12
                py-3
                rounded-xl
                border
                focus:outline-none
                "

              />


            </div>




            <select

              value={filter}

              onChange={(e)=>setFilter(e.target.value)}

              className="
              border
              rounded-xl
              px-5
              "

            >

              <option value="all">
                All
              </option>


              <option value="listing">
                Listings
              </option>


              <option value="purchase_request">
                Purchase Requests
              </option>


              <option value="order">
                Orders
              </option>


              <option value="transaction">
                Transactions
              </option>


              <option value="admin">
                Admin
              </option>


            </select>


          </div>


        </div>





        {/* TABLE */}



        <div className="bg-white rounded-2xl border overflow-hidden">


        {
          loading ?


          <div className="p-10 text-center text-gray-500">

            Loading activity...

          </div>



          : filteredActivities.length === 0 ?



          <div className="p-10 text-center text-gray-500">

            No activity found.

          </div>




          :



          <div className="overflow-x-auto">


            <table className="min-w-full">


              <thead className="bg-[#F7F5F1] border-b">


                <tr>


                  <th className="px-6 py-4 text-left">
                    Action
                  </th>


                  <th className="px-6 py-4 text-left">
                    Type
                  </th>


                  <th className="px-6 py-4 text-left">
                    User
                  </th>


                  <th className="px-6 py-4 text-left">
                    Description
                  </th>


                  <th className="px-6 py-4 text-left">
                    Date
                  </th>


                </tr>


              </thead>




              <tbody>


              {
                filteredActivities.map((activity)=>(


                  <tr

                    key={activity.id}

                    className="
                    border-b
                    hover:bg-[#FAF7F2]
                    transition
                    "

                  >



                    <td className="px-6 py-4">


                      <span

                      className={`
                      px-3
                      py-1
                      rounded-full
                      text-xs
                      font-medium
                      ${getActionStyle(activity.action)}
                      `}

                      >

                        {activity.action}

                      </span>


                    </td>




                    <td className="px-6 py-4 capitalize">

                      {
                        activity.entity_type
                        ?.replace("_"," ")
                      }

                    </td>




                    <td className="px-6 py-4">


                      {
                        activity.admin?.full_name
                        ||
                        activity.user?.full_name
                        ||
                        "System"
                      }


                    </td>




                    <td className="px-6 py-4 text-gray-600">

                      {
                        activity.description
                        ||
                        "-"
                      }

                    </td>




                    <td className="px-6 py-4 text-gray-500">


                      {
                        new Date(
                          activity.created_at
                        )
                        .toLocaleString()
                      }


                    </td>


                  </tr>


                ))
              }


              </tbody>


            </table>


          </div>

        }


        </div>



      </main>


    </div>

  );

}