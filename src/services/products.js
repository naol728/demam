import supabase from "./supabase";

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
    i;
    const { name, description, price, stock_quantity, category_id, image_url } =
      data;
    if (
      !name ||
      !description ||
      !price ||
      !stock_quantity ||
      !category_id ||
      !image_url
    ) {
      throw new Error("please fill all filds ");
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
      image_url, // this could be a File or a string (existing URL)
    } = data;

    // Get current session to fetch user ID
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("Not authorized");

    let finalImageUrl = image_url;

    // If a new file is uploaded
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

    // Update the product by ID
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        stock_quantity,
        category_id,
        image_url: finalImageUrl,
        updated_at: new Date(),
      })
      .eq("id", id)
      .eq("seller_id", userId) // security: make sure user is the owner
      .select();

    if (updateError) throw new Error(updateError.message);

    return updatedProduct;
  } catch (err) {
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
