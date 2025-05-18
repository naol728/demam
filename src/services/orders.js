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
      .from("orders")
      .select(
        `
    *,
    user:user_id (
      id,
      name,
      email,
      phone
    ),
    order_items (
      quantity,
      price,
      product:product_id (
        id,
        name,
        image_url
      )
    )
  `
      )
      .eq("seller_id", userId);

    if (error) {
      console.error("Failed to fetch seller orders:", error.message);
      throw new Error(error.message);
    }
    console.log(data);

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
