import supabase from "./supabase";

export async function addToCart(productId, quantity = 1) {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data: existingCart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

    let cartId = existingCart?.id;

    if (!cartId) {
      const { data: newCart, error: newCartError } = await supabase
        .from("carts")
        .insert({ user_id: userId })
        .select()
        .single();

      if (newCartError) {
        console.error("Error creating cart:", newCartError);
        return;
      }

      cartId = newCart.id;
    }

    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .single();

    if (existingItem) {
      await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);
    } else {
      // 4. Add new item
      await supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: productId,
        quantity: quantity,
      });
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
