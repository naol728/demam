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

    const { data: addedcart, error } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        product_id: productId,
        quantity: quantity,
      });
    if (error) {
      throw new Error(error.message);
    }
    return { success: true, data: addedcart };
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function getallcartstobuyer() {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (cartError) throw new Error(cartError.message);
    if (!cart) throw new Error("Cart not found");

    const { data: cart_items, error } = await supabase
      .from("cart_items")
      .select(
        `*,product:product_id(
        id,
        name,
        price,
        image_url)`
      )
      .eq("cart_id", cart.id);

    if (error) throw new Error(error.message);
    return cart_items;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function addcartitemquantity(id, operation) {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();
    if (cartError) throw new Error(cartError.message);
    if (!cart) throw new Error("Cart not found");

    const { data: cart_item, error: itemError } = await supabase
      .from("cart_items")
      .select("id, quantity,product_id")
      .eq("cart_id", cart.id)
      .eq("product_id", id)
      .single();

    const { data: product } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", cart_item.product_id)
      .single();

    if (itemError) throw new Error(itemError.message);
    if (!cart_item) throw new Error("Cart item not found");

    let newQuantity;
    if (operation === "inc") {
      if (product.stock_quantity <= cart_item.quantity) {
        throw new Error("product quantity is not sufficent ");
      }

      newQuantity = cart_item.quantity + 1;
    } else {
      newQuantity = cart_item.quantity - 1;
    }

    if (newQuantity <= 0) {
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cart_item.id);
      if (deleteError) throw new Error(deleteError.message);
    } else {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cart_item.id);
      if (updateError) throw new Error(updateError.message);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
export async function deleteCartItem(id) {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();
    if (cartError) throw new Error(cartError.message);

    const { data: cart_item, error: itemError } = await supabase
      .from("cart_items")
      .select("id")
      .eq("cart_id", cart.id)
      .eq("product_id", id)
      .single();
    if (itemError) throw new Error(itemError.message);

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cart_item.id);
    if (deleteError) throw new Error(deleteError.message);
  } catch (err) {
    throw new Error(err.message);
  }
}
