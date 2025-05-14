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
    const data = await supabase
      .from("products")
      .select("*")
      .eq("id", userId)
      .select();

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
          merchant_id: userId,
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
