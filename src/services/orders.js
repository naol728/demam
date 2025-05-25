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
        price,
        quantity,
        seller_id,
        order:order_id (
          id,
          user_id,
          location,
          latitude,
          longitude,
          status,
          tracking_status,
          total_amount,
          created_at,
          user:user_id(
          name,
          email,
          phone
          )
        ),
        product:product_info (
          id,
          name,
          image_url,
          price,
          seller_id
        )
        `
      )
      .eq("seller_id", userId);

    if (error) {
      console.error("Failed to fetch seller orders:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getOrder = async (id) => {
  try {
    if (!id) throw new Error("please provide id to fetch");
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
      phone,         
      address,      
      created_at     
      ),
      order_items (
      id,
      quantity,
      status,
      product_info (
        id,
        name,
        price,
        image_url,
        seller_id,
        latitude,
        longitude
      )
      )
    `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Failed to fetch order:", error.message);
      throw new Error(error.message);
    }
    const filterd = data.order_items.filter(
      (el) => el.product_info.seller_id === userId
    );
    const amount = filterd.reduce(
      (sum, item) => sum + item.product_info.price * item.quantity,
      0
    );
    return { ...data, order_items: filterd || [], total_amount: amount };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const createAnOrder = async ({ latitude, longitude, location }) => {
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
        image_url,
        seller_id)`
      )
      .eq("cart_id", cart.id);

    if (error) throw new Error(error.message);

    const amount = cart_items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        tracking_status: "pending",
        total_amount: amount,
        latitude,
        longitude,
        location,
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);
    const orderItems = cart_items.map((item) => ({
      order_id: order.id,
      product_info: item.product_id,
      seller_id: item.product.seller_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: insertError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (insertError) {
      console.log(insertError);
      throw new Error("Failed to insert order_items");
    }

    await supabase.from("cart_items").delete().eq("cart_id", cart.id);

    console.log("Order placed successfully!", order.id);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getOrderstoBuyer = async () => {
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
      order_items:order_items (
        id,
        quantity,
        price,
        
        product:product_info (
        id,
        name,
        image_url,
        seller_id

        )
      )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getOrderById = async (id) => {
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
        order_items (
          id,
          quantity,
          price,
          status,
          product_info (
            id,
            name,
            image_url,
            price,
            longitude,
            latitude,
            location_name,
            seller:seller_id(
            name,
            email,
            phone)
          )
        )
      `
      )
      .eq("user_id", userId)
      .eq("id", id)
      .single(); // return single order

    if (error) throw error;

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateOrderItemStatus = async (data) => {
  try {
    const { id, status } = data;
    if (!id || !status) throw new Error("Missing item ID or status");

    const { data: updated, error } = await supabase
      .from("order_items")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return { message: "Order item status updated", data: updated };
  } catch (err) {
    throw new Error(err.message);
  }
};
