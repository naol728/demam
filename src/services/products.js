import supabase from "./supabase";

export const getAllProductsforlanding = async (page = 1, limit = 12) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data,
      error: fetchError,
      count,
    } = await supabase
      .from("products")
      .select(
        `
        *,
        user:seller_id (
          id,
          name,
          phone,
          email,
          profileimg
        ),
        catagory:category_id(
          name
        )
      `,
        { count: "exact" }
      )
      .range(from, to)
      .order("created_at", { ascending: false });

    if (fetchError) throw new Error(fetchError.message);

    return {
      data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getAllproductstobuyer = async (page = 1, limit = 10) => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw new Error(error.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const {
      data,
      error: fetchError,
      count,
    } = await supabase
      .from("products")
      .select(
        `
        *,
        user:seller_id (
          id,
          name,
          phone,
          email,
          profileimg
        ),
        catagory:category_id (
          name
        )
      `,
        { count: "exact" }
      )
      .range(from, to)
      .order("created_at", { ascending: false });

    if (fetchError) throw new Error(fetchError.message);

    const totalPages = count ? Math.ceil(count / limit) : 1;

    return {
      data: data || [],
      page,
      totalPages,
    };
  } catch (err) {
    console.error("getAllproductstobuyer error:", err.message);
    return {
      data: [],
      page,
      totalPages: 1,
    };
  }
};

export const getallProducts = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw new Error(error.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data, error: fetchError } = await supabase
      .from("products")
      .select(
        `
        *,
        category:category_id (
          id,
          name
        )
      `
      )
      .eq("seller_id", userId);

    if (fetchError) throw new Error(fetchError.message);

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const addnewProduct = async (data) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      image_url,
      location_name,
      latitude,
      longitude,
    } = data;

    if (
      !name ||
      !description ||
      !price ||
      !stock_quantity ||
      !category_id ||
      !image_url ||
      !latitude ||
      !longitude
    ) {
      throw new Error("Please fill all required fields.");
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("Not authorized");

    let productimgurl = null;

    if (image_url && image_url.name) {
      const fileExt = image_url.name.split(".").pop();
      const filePath = `products/${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, image_url);

      if (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      productimgurl = publicUrlData.publicUrl;
    }

    const { data: insertedProduct, error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price,
          stock_quantity,
          category_id,
          seller_id: userId,
          image_url: productimgurl,
          location_name,
          latitude,
          longitude,
        },
      ])
      .select();

    if (insertError) throw new Error(insertError.message);

    return insertedProduct;
  } catch (err) {
    throw new Error(err.message || "Failed to add product.");
  }
};

export const updateProduct = async (id, data) => {
  try {
    const {
      name,
      description,
      price,
      stock_quantity,
      category_id,
      image_url, // can be File or string (URL)
    } = data;

    // 1. Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("Not authorized");

    let finalImageUrl = image_url;

    // 2. Upload new image if it's a File
    if (image_url instanceof File) {
      const fileExt = image_url.name.split(".").pop();
      const filePath = `products/${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, image_url);

      if (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(filePath);

      finalImageUrl = publicUrl;
    }

    // 3. Update the product
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        stock_quantity,
        category_id,
        image_url: finalImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("seller_id", userId) // security check
      .select();

    if (updateError) throw new Error(updateError.message);
    if (!updatedProduct || updatedProduct.length === 0)
      throw new Error("No product was updated");

    return updatedProduct[0]; // Return the single updated product
  } catch (err) {
    console.error("UpdateProduct Error:", err);
    throw new Error("Update failed: " + err.message);
  }
};
export const getProductById = async (productId) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single(); // Ensures you only get one row, not an array

    if (error) {
      throw new Error("Failed to fetch product: " + error.message);
    }

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteProduct = async (productId) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Failed to delete product:", error.message);
      throw new Error(error.message);
    }

    return { success: true, message: "Product deleted successfully." };
  } catch (err) {
    if (
      error.message?.includes("violates foreign key constraint") &&
      error.message?.includes("order_items_product_info_fkey")
    ) {
      throw new Error("Cannot delete product: it's part of an order.");
    }
    throw new Error(err.message);
  }
};
