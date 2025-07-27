import supabase from "./supabase";

export const addPayment = async (data) => {
  try {
    const { order_id, payment_method, amount, file } = data;
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    if (!order_id || !payment_method || !amount || !file) {
      throw new Error(
        "Order ID, payment method, amount, and file are required."
      );
    }
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("payment")
      .upload(filePath, file);

    if (uploadError)
      throw new Error("File upload failed: " + uploadError.message);

    const {
      data: { publicUrl },
    } = supabase.storage.from("payment").getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("payments").insert({
      order_id,
      payment_method,
      amount,
      payment_img: publicUrl,
    });

    if (insertError)
      throw new Error("Failed to save payment: " + insertError.message);

    return { success: true };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getPaymentsByOrderId = async (orderID) => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderID);

    if (error) throw new Error("Failed to fetch payments: " + error.message);

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updatePaymentStatustobuyer = async (data) => {
  try {
    const { id, status } = data;

    if (!id || !status) {
      throw new Error("Payment ID and status are required.");
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;

    if (!userId) throw new Error("User ID not found");

    const { error } = await supabase
      .from("payments")
      .update({ status })
      .eq("id", id);

    if (error) {
      throw new Error("Failed to update payment status: " + error.message);
    }
    return { success: true };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updatepayment = async ({ id, payment_method, amount, file }) => {
  try {
    if (!id) {
      throw new Error("Payment ID is required.");
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found.");

    let payment_img = null;

    if (file) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `receipts/${userId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("payment")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Failed to upload receipt image.");
      }
      const { data: publicUrlData } = supabase.storage
        .from("payment")
        .getPublicUrl(filePath);
      payment_img = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("payments")
      .update({
        ...(payment_method && { payment_method }),
        ...(amount && { amount: parseFloat(amount) }),
        ...(payment_img && { payment_img }),
      })
      .eq("id", id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return true;
  } catch (err) {
    console.log(err);
    throw new Error(err.message || "Failed to update payment.");
  }
};
