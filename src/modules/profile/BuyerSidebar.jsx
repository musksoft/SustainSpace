import {
  LayoutDashboard,
  ClipboardList,
  Receipt,
  MessageSquare,
  User,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";


export default function BuyerSidebar() {

  const navigate = useNavigate();


  const handleLogout = async () => {

    const { error } = await supabase.auth.signOut();

    if (!error) {
      navigate("/");
    }

  };


  return (

    <>


      {/* DESKTOP SIDEBAR */}

      <aside
        className="
          hidden
          md:flex
          w-64
          bg-[#fcf4e6]
          border-r
          flex-col
          justify-between
          p-5
        "
      >


        <div>




          <nav className="space-y-2">


            <button
              onClick={() => navigate("/buyer/:id")}
              className="
                w-full
                flex
                items-center
                gap-3
                bg-[#1F3D2A]
                text-white
                px-4
                py-3
                rounded-lg
              "
            >

              <LayoutDashboard size={18}/>

              Dashboard

            </button>




            <button
              onClick={() => navigate("/buyer/orders")}
              className="
                w-full
                flex
                items-center
                gap-3
                text-gray-700
                hover:bg-gray-100
                px-4
                py-3
                rounded-lg
              "
            >

              <ClipboardList size={18}/>

              Orders

            </button>





            <button
              onClick={() => navigate("/buyer-transaction")}
              className="
                w-full
                flex
                items-center
                gap-3
                text-gray-700
                hover:bg-gray-100
                px-4
                py-3
                rounded-lg
              "
            >

              <Receipt size={18}/>

              Transaction History

            </button>





            <button
              onClick={() => navigate("/message")}
              className="
                w-full
                flex
                items-center
                gap-3
                text-gray-700
                hover:bg-gray-100
                px-4
                py-3
                rounded-lg
              "
            >

              <MessageSquare size={18}/>

              Messages

            </button>





            <button
              onClick={() => navigate("/profile/:id")}
              className="
                w-full
                flex
                items-center
                gap-3
                text-gray-700
                hover:bg-gray-100
                px-4
                py-3
                rounded-lg
              "
            >

              <User size={18}/>

              Profile

            </button>



          </nav>


        </div>





        <button
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2
            text-red-500
            hover:bg-red-50
            px-3
            py-2
            rounded-lg
          "
        >

          <LogOut size={18}/>

          Logout

        </button>



      </aside>









      {/* MOBILE BOTTOM NAVIGATION */}

      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          md:hidden
          h-16
          bg-[#fcf4e6]
          border-t
          flex
          items-center
          justify-around
          z-50
        "
      >


        <button
          onClick={() => navigate("/buyer")}
          className="
            flex
            flex-col
            items-center
            text-[#1F3D2A]
            text-xs
          "
        >

          <LayoutDashboard size={22}/>

          Dashboard

        </button>





        <button
          onClick={() => navigate("/buyer/orders")}
          className="
            flex
            flex-col
            items-center
            text-gray-600
            text-xs
          "
        >

          <ClipboardList size={22}/>

          Orders

        </button>





        <button
          onClick={() => navigate("/buyer-transaction")}
          className="
            flex
            flex-col
            items-center
            text-gray-600
            text-xs
          "
        >

          <Receipt size={22}/>

          History

        </button>





        <button
          onClick={() => navigate("/message")}
          className="
            flex
            flex-col
            items-center
            text-gray-600
            text-xs
          "
        >

          <MessageSquare size={22}/>

          Messages

        </button>





        <button
          onClick={() => navigate("/profile/:id")}
          className="
            flex
            flex-col
            items-center
            text-gray-600
            text-xs
          "
        >

          <User size={22}/>

          Profile

        </button>



      </nav>


    </>

  );

}