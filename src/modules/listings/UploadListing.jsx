import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { assets } from "../../assets/assets";
import { Upload, X, Image as ImageIcon, MapPin, Camera } from "lucide-react";
import { supabase } from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";

const UploadListing = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [featuredImage, setFeaturedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        navigate("/auth");
        return;
      }

      if (profile.role !== "seller") {
        alert("Only sellers can access this page.");
        navigate(`/buyer/${user.id}`);
      }
    };

    checkAccess();
  }, [navigate]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    location: "",
    status: "available",
  });

  const [dimensions, setDimensions] = useState({
    width: "",
    height: "",
    depth: "",
  });

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  /* =========================
     IMAGE VALIDATION
  ========================= */

  const validateImageFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      return "Only JPG and PNG files are allowed";
    }

    return null;
  };

  /* =========================
     FIELD VALIDATION
  ========================= */

  const validateField = (name, value) => {
    switch (name) {
      case "title":
        if (!value || !value.trim()) {
          return "Listing Title is required";
        }
        return "";

      case "price":
        if (!value) {
          return "Price is required";
        }

        if (isNaN(value) || Number(value) <= 0) {
          return "Enter a valid price greater than 0";
        }

        return "";

      case "description":
        if (!value || !value.trim()) {
          return "Description is required";
        }

        if (value.trim().length < 50) {
          return `Description must be at least 50 characters (${value.trim().length}/50)`;
        }

        return "";

      case "category":
        return value ? "" : "Please select a category";

      case "condition":
        return value ? "" : "Please select a condition";

      case "location":
        if (!value || !value.trim()) {
          return "Location is required";
        }

        return "";

      case "width":
      case "height":
      case "depth":
        if (!value) {
          return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }

        if (isNaN(value) || Number(value) <= 0) {
          return `${name.charAt(0).toUpperCase() + name.slice(1)} must be greater than 0`;
        }

        return "";

      default:
        return "";
    }
  };

  /* =========================
     FORM VALIDATION
  ========================= */

  const validateForm = () => {
    const newErrors = {};

    /* Featured image */

    if (!featuredImage) {
      newErrors.featuredImage = "Featured image is required";
    }

    /* Gallery */

    if (galleryImages.length < 1) {
      newErrors.galleryImages = "Upload at least one gallery image";
    }

    /* Form fields */

    [
      "title",
      "price",
      "description",
      "category",
      "condition",
      "location",
    ].forEach((field) => {
      const error = validateField(field, form[field]);

      if (error) {
        newErrors[field] = error;
      }
    });

    /* Dimensions */

    ["width", "height", "depth"].forEach((field) => {
      const error = validateField(field, dimensions[field]);

      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);

    console.log("VALIDATION ERRORS:", newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     GALLERY UPLOAD
  ========================= */

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const validFiles = [];

    for (const file of files) {
      const error = validateImageFile(file);

      if (error) {
        setErrors((prev) => ({
          ...prev,
          galleryImages: error,
        }));
        return;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setErrors((prev) => ({
      ...prev,
      galleryImages: "",
    }));

    setGalleryImages((prev) => {
      const combined = [...prev, ...validFiles];

      return combined.slice(0, 2);
    });

    /* Reset input so same file can be selected again */

    e.target.value = "";
  };

  /* =========================
     REMOVE GALLERY IMAGE
  ========================= */

  const removeGalleryImage = (index) => {
    const imageToRemove = galleryImages[index];

    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const updated = galleryImages.filter((_, i) => i !== index);

    setGalleryImages(updated);

    if (updated.length === 0) {
      setErrors((prev) => ({
        ...prev,
        galleryImages: "Upload at least one gallery image",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        galleryImages: "",
      }));
    }
  };

  /* =========================
     FEATURED IMAGE / CAMERA
  ========================= */

  const captureFeaturedImage = () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      setFeaturedImage(imageSrc);

      setErrors((prev) => ({
        ...prev,
        featuredImage: "",
      }));

      setCameraOpen(false);
    }
  };

  /* =========================
     CO2 CALCULATION
  ========================= */

  const CO2_FACTOR = 0.0005;

  const calculateCO2 = () => {
    const { width, height, depth } = dimensions;

    const widthNum = Number(width);
    const heightNum = Number(height);
    const depthNum = Number(depth);

    if (!widthNum || !heightNum || !depthNum) return 0;

    const volume = widthNum * heightNum * depthNum;
    const co2 = volume * CO2_FACTOR;

    return Math.round(co2);
  };

  const co2Value = calculateCO2();

  /* =========================
     DATA URL TO BLOB
  ========================= */

  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(",");

    const mime = arr[0].match(/:(.*?);/)[1];

    const bstr = atob(arr[1]);

    let n = bstr.length;

    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {
      type: mime,
    });
  };

  /* =========================
     PUBLISH LISTING
  ========================= */

  const handlePublish = async () => {
    const valid = validateForm();

    console.log("FORM VALID?", valid);
    console.log("ERRORS:", errors);

    if (!valid) {
      alert("Please fix the validation errors before publishing.");
      return;
    }

    console.log("STEP 1 - FORM VALID");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      console.log("USER:", user);

      if (authError) throw authError;

      if (!user) {
        alert("Please login first");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("PROFILE:", profile);

      if (profileError) throw profileError;

      if (profile.role !== "seller") {
        alert("Only sellers can create listings");
        return;
      }

      /* =========================
         FEATURED IMAGE
      ========================= */

      const featuredPath = `${user.id}/${Date.now()}-featured.jpg`;

      const featuredBlob = dataURLtoBlob(featuredImage);

      const {
        data: featuredUploadData,
        error: featuredUploadError,
      } = await supabase.storage
        .from("listing-images")
        .upload(featuredPath, featuredBlob);

      console.log("FEATURED UPLOAD:", featuredUploadData);

      if (featuredUploadError) throw featuredUploadError;

      const { data: featuredPublic } = supabase.storage
        .from("listing-images")
        .getPublicUrl(featuredPath);

      const featuredUrl = featuredPublic.publicUrl;

      console.log("FEATURED URL:", featuredUrl);
      console.log("STEP 4 - FEATURED IMAGE UPLOADED");

      /* =========================
         GALLERY IMAGES
      ========================= */

      const galleryUrls = [];

      for (const image of galleryImages) {
        const file = image.file;

        const path = `${user.id}/${Date.now()}-${file.name}`;

        const {
          data: galleryUploadData,
          error,
        } = await supabase.storage
          .from("listing-images")
          .upload(path, file);

        console.log("GALLERY UPLOAD:", galleryUploadData);

        if (error) throw error;

        const { data } = supabase.storage
          .from("listing-images")
          .getPublicUrl(path);

        galleryUrls.push(data.publicUrl);
      }

      console.log("GALLERY URLS:", galleryUrls);
      console.log("STEP 5 - GALLERY IMAGES UPLOADED");

      /* =========================
         INSERT PAYLOAD
      ========================= */

      const listingPayload = {
        seller_id: user.id,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        item_condition: form.condition,
        location: form.location,
        width: Number(dimensions.width),
        height: Number(dimensions.height),
        depth: Number(dimensions.depth),
        featured_image: featuredUrl,
        gallery_images: galleryUrls,
        status: form.status,
      };

      console.log("STEP 6 - ABOUT TO INSERT");
      console.log(listingPayload);

      const { data, error } = await supabase
        .from("listings")
        .insert([listingPayload])
        .select();

      console.log("DATA:", data);
      console.log("ERROR:", error);
      console.log("STEP 7 - INSERT FINISHED");
      console.log("INSERTING LISTING:", listingPayload);
      console.log("FULL INSERT RESPONSE:", { data, error });

      if (error) {
        console.error("INSERT FAILED:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn("INSERT BLOCKED OR NO ROW RETURNED");
      }

      alert("Listing created successfully");

      navigate(`/seller/${user.id}`);
    } catch (err) {
      console.error("FULL ERROR OBJECT:", err);

      alert(err?.message || JSON.stringify(err, null, 2));
    }
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div className="min-h-screen bg-[#F6F4F1] flex">
      {/* Sidebar */}

      <aside className="hidden md:block w-64 bg-white border-r p-6">
        <h1 className="font-serif text-2xl mb-8">SustainSpace</h1>

        <button className="w-full bg-[#16362D] text-white py-3 rounded-lg">
          List New Item
        </button>
      </aside>

      {/* Main Content */}

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-[#16362D] mb-3">
          List a New Creation
        </h1>

        <p className="text-stone-500 mb-10">
          Provide imagery and details for conscious collectors.
        </p>

        {/* =========================
            MEDIA & GALLERY
        ========================= */}

        <section className="bg-white rounded-3xl p-8 border mb-10">
          <h2 className="text-2xl font-serif mb-6">Media & Gallery</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Featured Image */}

            <div className="lg:col-span-2">
              {featuredImage ? (
                <div className="relative h-[350px] rounded-2xl overflow-hidden border">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage(null);

                      setErrors((prev) => ({
                        ...prev,
                        featuredImage: "Featured image is required",
                      }));
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : cameraOpen ? (
                <div className="border rounded-2xl overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-[350px] object-cover"
                  />

                  <div className="flex gap-3 p-4">
                    <button
                      type="button"
                      onClick={captureFeaturedImage}
                      className="bg-[#16362D] text-white px-5 py-2 rounded-lg"
                    >
                      Capture Photo
                    </button>

                    <button
                      type="button"
                      onClick={() => setCameraOpen(false)}
                      className="border px-5 py-2 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-[350px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center">
                  <div className="flex gap-10">
                    {/* Camera */}

                    <button
                      type="button"
                      onClick={() => setCameraOpen(true)}
                      className="flex flex-col items-center"
                    >
                      <Camera size={50} />

                      <span className="mt-2 text-sm">Take Photo</span>
                    </button>
                  </div>
                </div>
              )}

              {errors.featuredImage && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.featuredImage}
                </p>
              )}
            </div>

            {/* Gallery Images */}

            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => {
                const img = galleryImages[i];

                if (img) {
                  return (
                    <div
                      key={i}
                      className="relative h-[140px] border rounded-xl overflow-hidden"
                    >
                      <img
                        src={img.preview}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                }

                return (
                  <label key={i} className="cursor-pointer">
                    <input
                      type="file"
                      hidden
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleGalleryUpload}
                    />

                    <div className="h-[140px] w-full border-2 border-dashed rounded-xl flex items-center justify-center flex-col">
                      <Upload size={30} />

                      <span className="mt-2 text-sm">
                        Upload Image
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {errors.galleryImages && (
            <p className="text-red-500 text-sm mt-3">
              {errors.galleryImages}
            </p>
          )}
        </section>

        {/* =========================
            ITEM DETAILS
        ========================= */}

        <section className="bg-white rounded-3xl p-8 border mb-10">
          <h2 className="text-2xl font-serif mb-6">Item Identity</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                placeholder="Listing Title"
                className={`border p-3 rounded-xl w-full ${
                  errors.title ? "border-red-500" : ""
                }`}
                value={form.title}
                onChange={(e) => {
                  const value = e.target.value;

                  setForm({
                    ...form,
                    title: value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    title: validateField("title", value),
                  }));
                }}
                onBlur={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    title: validateField("title", e.target.value),
                  }));
                }}
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                className={`border p-3 rounded-xl w-full ${
                  errors.price ? "border-red-500" : ""
                }`}
                value={form.price}
                onChange={(e) => {
                  const value = e.target.value;

                  setForm({
                    ...form,
                    price: value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    price: validateField("price", value),
                  }));
                }}
                onBlur={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    price: validateField("price", e.target.value),
                  }));
                }}
              />

              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            DESCRIPTION
        ========================= */}

        <section className="bg-white rounded-3xl p-8 border mb-10">
          <h2 className="text-2xl font-serif mb-6">Detailed Story</h2>

          <textarea
            rows={5}
            placeholder="Tell the story of this piece..."
            className={`w-full border p-4 rounded-xl ${
              errors.description ? "border-red-500" : ""
            }`}
            value={form.description}
            onChange={(e) => {
              const value = e.target.value;

              setForm({
                ...form,
                description: value,
              });

              setErrors((prev) => ({
                ...prev,
                description: validateField("description", value),
              }));
            }}
            onBlur={(e) => {
              setErrors((prev) => ({
                ...prev,
                description: validateField(
                  "description",
                  e.target.value
                ),
              }));
            }}
          />

          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-red-500 text-xs">
                {errors.description}
              </p>
            ) : (
              <span />
            )}

            <p className="text-xs text-gray-400">
              {form.description.trim().length}/50 minimum
            </p>
          </div>
        </section>

        {/* =========================
            ATTRIBUTES
        ========================= */}

        <section className="bg-white rounded-3xl p-8 border mb-10">
          <h2 className="text-2xl font-serif mb-6">Attributes</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <select
                className={`border p-3 rounded-xl w-full ${
                  errors.category ? "border-red-500" : ""
                }`}
                value={form.category}
                onChange={(e) => {
                  const value = e.target.value;

                  setForm({
                    ...form,
                    category: value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    category: validateField("category", value),
                  }));
                }}
                onBlur={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    category: validateField(
                      "category",
                      e.target.value
                    ),
                  }));
                }}
              >
                <option value="">Category</option>
                <option value="Tables">Tables</option>
                <option value="Chairs">Chairs</option>
                <option value="Sofas">Sofas</option>
                <option value="Storage">Storage</option>
              </select>

              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <select
                className={`border p-3 rounded-xl w-full ${
                  errors.condition ? "border-red-500" : ""
                }`}
                value={form.condition}
                onChange={(e) => {
                  const value = e.target.value;

                  setForm({
                    ...form,
                    condition: value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    condition: validateField("condition", value),
                  }));
                }}
                onBlur={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    condition: validateField(
                      "condition",
                      e.target.value
                    ),
                  }));
                }}
              >
                <option value="">Condition</option>
                <option value="New">New</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>

              {errors.condition && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.condition}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            LISTING STATUS
        ========================= */}

        <section className="bg-white rounded-3xl p-8 border mb-10">
          <h2 className="text-2xl font-serif mb-6">Listing Status</h2>

          <select
            className="border p-3 rounded-xl w-full"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </section>

        {/* =========================
            TECHNICAL SPECS
        ========================= */}

        <section className="bg-white rounded-3xl p-8 border mb-10">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-serif">Technical Specs</h2>

            <span className="text-sm text-gray-400">
              Step 4 of 6
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* WIDTH */}

            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Width (cm)"
                className={`border-b p-3 outline-none w-full ${
                  errors.width ? "border-red-500" : ""
                }`}
                value={dimensions.width}
                onChange={(e) => {
                  const value = e.target.value;

                  setDimensions({
                    ...dimensions,
                    width: value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    width: validateField("width", value),
                  }));
                }}
                onBlur={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    width: validateField("width", e.target.value),
                  }));
                }}
              />

              {errors.width && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.width}
                </p>
              )}
            </div>

            {/* HEIGHT */}

            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Height (cm)"
                className={`border-b p-3 outline-none w-full ${
                  errors.height ? "border-red-500" : ""
                }`}
                value={dimensions.height}
                onChange={(e) => {
                  const value = e.target.value;

                  setDimensions({
                    ...dimensions,
                    height: value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    height: validateField("height", value),
                  }));
                }}
                onBlur={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    height: validateField(
                      "height",
                      e.target.value
                    ),
                  }));
                }}
              />

              {errors.height && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.height}
                </p>
              )}
            </div>

            {/* DEPTH */}

            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Depth (cm)"
                className={`border-b p-3 outline-none w-full ${
                  errors.depth ? "border-red-500" : ""
                }`}
                value={dimensions.depth}
                onChange={(e) => {
                  const value = e.target.value;

                  setDimensions({
                    ...dimensions,
                    depth: value,
                  });

                  setErrors((prev) => ({
                    ...prev,
                    depth: validateField("depth", value),
                  }));
                }}
                onBlur={(e) => {
                  setErrors((prev) => ({
                    ...prev,
                    depth: validateField("depth", e.target.value),
                  }));
                }}
              />

              {errors.depth && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.depth}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =========================
            LOGISTICS
        ========================= */}

        <section className="bg-white rounded-3xl p-8 border mb-10">
          <div className="flex justify-between mb-6">
            <h2 className="text-2xl font-serif">Logistics</h2>

            <span className="text-sm text-gray-400">
              Step 6 of 6
            </span>
          </div>

          <div className="bg-[#F6F4F1] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Left */}

            <div className="w-full">
              <label className="text-sm text-gray-500">
                Pickup Location
              </label>

              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-3 text-gray-400" />

                <input
                  placeholder="Enter studio address or city"
                  className={`w-full border-b pl-10 p-3 outline-none bg-transparent ${
                    errors.location ? "border-red-500" : ""
                  }`}
                  value={form.location}
                  onChange={(e) => {
                    const value = e.target.value;

                    setForm({
                      ...form,
                      location: value,
                    });

                    setErrors((prev) => ({
                      ...prev,
                      location: validateField(
                        "location",
                        value
                      ),
                    }));
                  }}
                  onBlur={(e) => {
                    setErrors((prev) => ({
                      ...prev,
                      location: validateField(
                        "location",
                        e.target.value
                      ),
                    }));
                  }}
                />
              </div>

              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location}
                </p>
              )}

              <p className="text-sm text-gray-400 mt-3 italic">
                Buyers prefer local pickup for large items to
                reduce carbon footprint.
              </p>
            </div>

            {/* Right */}

            <div className="w-full md:w-[250px] h-[150px] rounded-xl overflow-hidden">
              <img
                src={assets.map}
                alt="map"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* =========================
            CONSCIOUS IMPACT
        ========================= */}

        <section className="mb-10">
          <div className="bg-[#2F4F3E] text-white rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-[#1E3D32] p-4 rounded-xl">
                🌿
              </div>

              <div>
                <h3 className="text-xl font-serif">
                  Conscious Impact
                </h3>

                <p className="text-sm text-green-100">
                  By listing this restored piece, you are saving
                  approximately{" "}
                  <strong>
                    {co2Value ? `${co2Value}kg` : "--"} of CO2
                  </strong>{" "}
                  compared to new furniture production.
                </p>
              </div>
            </div>

            <div className="bg-[#1E3D32] px-6 py-4 rounded-xl text-center">
              <p className="text-xs tracking-widest">
                TOTAL OFFSET
              </p>

              <p className="text-2xl font-serif">
                {co2Value ? `${co2Value}kg` : "--"}
              </p>
            </div>
          </div>
        </section>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="flex justify-between items-center">
          <button
            type="button"
            className="text-gray-500"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => {
              console.log("BUTTON CLICKED");

              handlePublish();
            }}
            className="bg-[#16362D] text-white px-8 py-3 rounded-xl"
          >
            Publish Listing
          </button>
        </div>
      </main>
    </div>
  );
};

export default UploadListing;
