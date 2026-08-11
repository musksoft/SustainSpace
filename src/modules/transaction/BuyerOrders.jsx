import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../config/supabaseClient";
import BuyerSidebar from "../profile/BuyerSidebar";


export default function BuyerOrders() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);



  useEffect(() => {

    loadOrders();

  }, []);



  const loadOrders = async () => {

    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();



    if(!user){

      navigate("/");

      return;

    }



    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();



    setProfile(profileData);



    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        listings(
          title,
          gallery_images,
          price
        ),
        seller:profiles!orders_seller_id_fkey(
          full_name,
          email
        ),
        transactions(
          id,
          status,
          delivery_method,
          payment_method
        )
      `)
      .eq("buyer_id", user.id)
      .order("created_at", {
        ascending:false
      });



    if(error){

      console.error(error);

      return;

    }



    setOrders(data || []);

  };


return (

<div className="min-h-screen bg-[#FAF7F2] flex">


{/* SIDEBAR */}

<BuyerSidebar />



{/* MAIN */}

<main className="flex-1 flex flex-col">









{/* CONTENT */}

<div
className="
px-8
py-8
space-y-8
pb-24
"
>



{/* PAGE TITLE */}


<div>

<p
className="
uppercase
tracking-[0.2em]
text-xs
font-semibold
text-[#8B5E3C]
"
>
ORDER HISTORY
</p>



<h2
className="
text-3xl
font-serif
text-[#1F3D2A]
mt-2
"
>
Your Furniture Journey
</h2>



<p className="text-gray-500 mt-2">
Track your accepted requests, active orders,
and completed purchases.
</p>


</div>
{/* ORDERS */}


<section className="space-y-5">


{
orders.length === 0 ? (


<div
className="
bg-white
rounded-3xl
border
border-[#E8DED2]
p-10
text-center
text-gray-500
"
>

No orders yet.

</div>


)


:


orders.map((order)=>{


const transaction = order.transactions?.[0];

const completed =
transaction?.status === "completed";


return (


<div
key={order.id}
className="
bg-white
rounded-3xl
border
border-[#E8DED2]
p-6
hover:shadow-md
transition
"
>


<div
className="
flex
flex-col
lg:flex-row
justify-between
gap-8
"
>



{/* LEFT PRODUCT */}


<div
className="
flex
gap-5
"
>


<img
src={
order.listings?.gallery_images ||
"https://placehold.co/120"
}
className="
w-28
h-28
rounded-2xl
object-cover
"
/>



<div>


<h3
className="
text-xl
font-semibold
text-[#1F3D2A]
"
>
{order.listings?.title}
</h3>



<p
className="
text-sm
text-gray-500
mt-3
"
>
Seller

<span
className="
ml-2
text-gray-800
font-medium
"
>
{order.seller?.full_name || "Seller"}
</span>

</p>



<p
className="
text-[#8B5E3C]
font-semibold
text-lg
mt-2
"
>
€
{
order.agreed_price ??
order.listings?.price
}
</p>



{/* JOURNEY */}


<div
className="
mt-5
flex
items-center
flex-wrap
gap-3
text-sm
"
>


<div className="flex items-center gap-2">

<div
className="
w-6
h-6
rounded-full
bg-[#1F3D2A]
text-white
flex
items-center
justify-center
text-xs
"
>
✓
</div>

<span>
Accepted
</span>

</div>



<div
className="
w-10
h-[2px]
bg-[#1F3D2A]
hidden
sm:block
"
/>



<div className="flex items-center gap-2">


<div
className="
w-6
h-6
rounded-full
bg-[#1F3D2A]
text-white
flex
items-center
justify-center
text-xs
"
>
✓
</div>


<span>
Order Created
</span>


</div>




<div
className={`
w-10
h-[2px]
hidden
sm:block
${
completed
?
"bg-[#1F3D2A]"
:
"bg-gray-300"
}
`}
/>




<div className="flex items-center gap-2">


<div
className={`
w-6
h-6
rounded-full
flex
items-center
justify-center
text-xs
${
completed
?
"bg-[#1F3D2A] text-white"
:
"bg-gray-200 text-gray-500"
}
`}
>

{
completed
?
"✓"
:
"3"
}

</div>


<span>
Completed
</span>


</div>


</div>


</div>


</div>





{/* RIGHT SIDE */}


<div
className="
flex
lg:flex-col
items-center
lg:items-end
justify-between
gap-4
"
>


<span
className={`
px-4
py-2
rounded-full
text-sm
font-medium

${
completed
?
"bg-green-100 text-green-700"
:
"bg-yellow-100 text-yellow-700"
}

`}
>

{
completed
?
"Completed"
:
"Processing"
}

</span>




<button

onClick={()=>navigate("/transaction",{
state:{
order
}
})}

className="
bg-[#1F3D2A]
hover:bg-[#31523F]
text-white
px-5
py-2
rounded-xl
transition
"
>

Manage Order →

</button>


</div>




</div>


</div>


)


})

}


</section>
</div>

</main>

</div>

);
}