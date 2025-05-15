import supabase from "./supabase";

export const updateUser = async (updates) => {
  try {
    const { name, email, phone, address, profileimg } = updates;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const userId = session?.user?.id;
    if (!userId) throw new Error("User ID not found");

    let profileImageUrl = null;

    if (profileimg) {
      const fileExt = profileimg.name.split(".").pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, profileimg, {
          upsert: true,
        });

      if (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      profileImageUrl = publicUrl;
    }

    const updatePayload = {
      ...(name && { name }),
      ...(email && { email }),
      ...(profileImageUrl && { profile_image: profileImageUrl }),
    };

    if (phone || address) {
      await supabase
        .from("profiles")
        .update({
          ...(phone && { phone_number: phone }),
          ...(address && { address }),
        })
        .eq("user_id", userId);
    }

    const { data, error } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
