import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status:"",
    category: "",
    item_condition: "",
    location: "",
    width: "",
    height: "",
    depth: "",
    featured_image: "",
  });

  useEffect(() => {
    loadListing();
  }, [id]);

  const loadListing = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in.");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Extra UI-level ownership check.
      // RLS is still the actual security mechanism.
      if (data.seller_id !== user.id) {
        alert("You are not allowed to edit this listing.");
        navigate(`/listing/${id}`);
        return;
      }

      if (data.status === "sold") {
        alert("Sold listings cannot be edited.");
        navigate(`/listing/${id}`);
        return;
      }
      setFormData({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        category: data.category || "",
        item_condition: data.item_condition || "",
        location: data.location || "",
        width: data.width || "",
        height: data.height || "",
        depth: data.depth || "",
        status: data.status || "",
        featured_image: data.featured_image || "",
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
      navigate(`/listing/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in.");
    }

    // Get current listing ownership and status
    const { data: currentListing, error: listingError } =
      await supabase
        .from("listings")
        .select("seller_id, status")
        .eq("id", id)
        .single();

    if (listingError) {
      throw listingError;
    }

    // Ownership check
    if (currentListing.seller_id !== user.id) {
      throw new Error(
        "You are not allowed to edit this listing."
      );
    }

    // Sold listing check
    if (currentListing.status === "sold") {
      throw new Error(
        "Sold listings cannot be edited."
      );
    }

    const { data, error } = await supabase
      .from("listings")
      .update({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        item_condition: formData.item_condition,
        location: formData.location,
        width: Number(formData.width),
        height: Number(formData.height),
        depth: Number(formData.depth),
        status: formData.status,
        featured_image: formData.featured_image,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    console.log("✓ Listing updated:", data);

    alert("Listing updated successfully.");

    navigate(`/listing/${id}`);

  } catch (error) {
    console.error(error);
    alert(`Update failed: ${error.message}`);
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading listing...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F1] py-10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-serif text-[#1F3D2A]">Edit Listing</h1>

          <p className="text-gray-500 mt-2 mb-8">
            Update the details of your listing.
          </p>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Title</label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Price</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Category</label>

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Condition</label>

              <input
                name="item_condition"
                value={formData.item_condition}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Location</label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 font-medium">Width</label>

                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Height</label>

                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Depth</label>

                <input
                  type="number"
                  name="depth"
                  value={formData.depth}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3"
                />
              </div>
            </div>

 <div>
              <label className="block mb-2 font-medium">Status</label>

              <input
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Featured Image</label>

              <input
                name="featured_image"
                value={formData.featured_image}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/listing/${id}`)}
                className="flex-1 border py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-[#1F3D2A] text-white py-3 rounded-xl disabled:opacity-50"
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
