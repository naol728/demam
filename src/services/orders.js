import supabase from "./supabase";

export const getOrders = async () => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data, error } = await supabase
      .from("order_items")
      .select(
        `
      id,
      quantity,
      price,
      order:order_id (
        id,
        user_id:users(
           name,
           email,
           profileimg,
           phone
        ),
        total_amount,
        status,
        created_at
      ),
      product:product_id (
        id,
        name,
        image_url,
        seller_id
      )
    `
      )
      .eq("product.seller_id", userId);

    if (error) {
      console.error("Failed to fetch seller orders:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
