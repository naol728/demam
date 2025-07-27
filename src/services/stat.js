import supabase from "./supabase";

export const getStats = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw new Error(error.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*,category:category_id(name)")
      .eq("seller_id", userId);

    if (productsError)
      throw new Error(
        productsError.message ||
          "unexpected thing happennd while fetching the statucs"
      );

    const categoryCounts = {
      "Health & Beauty": 0,
      Fashion: 0,
      "Home & Living": 0,
      Electronics: 0,
      "Sports & Outdoors": 0,
    };

    products.forEach((product) => {
      const catName = product.category?.name;
      if (categoryCounts.hasOwnProperty(catName)) {
        categoryCounts[catName]++;
      }
    });
    const totalPrice = products.reduce((acc, product) => {
      acc = +product.price || 0;
      return acc;
    }, 0);
    const allproducts = products.length;
    const avarageprice = Math.round(totalPrice / allproducts);

    const { data: orders, error: orderserror } = await supabase
      .from("order_items")
      .select("*")
      .eq("seller_id", userId);
    if (orderserror)
      throw new Error(orderserror.message || "Error fetching orders");

    const orderStatusCount = {
      confirmed: 0,
      pending: 0,
      deliverd: 0,
    };
    orders.forEach((order) => {
      const status = order.status;
      if (orderStatusCount.hasOwnProperty(status)) {
        orderStatusCount[status]++;
      }
    });
    const orderscount = orders.length;
    const totalorderprice = orders.reduce((acc, order) => {
      acc += order.price || 0;
      return acc;
    }, 0);

    return {
      products,
      categoryCounts,
      allproducts,
      avarageprice,
      orderStatusCount,
      orderscount,
      totalorderprice,
    };
  } catch (err) {
    throw new Error(
      err.message || "An unexpected error occurred while fetching stats."
    );
  }
};
