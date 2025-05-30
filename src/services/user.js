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

    if (profileimg && profileimg.name) {
      const fileExt = profileimg.name.split(".").pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, profileimg, { upsert: true });

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
      ...(phone && { phone }),
      ...(address && { address }),
      ...(profileImageUrl && { profileimg: profileImageUrl }),
    };

    const { data, error } = await supabase
      .from("users")
      .update(updatePayload)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw new Error(sessionError.message);

    const user = session?.user;
    if (!user) throw new Error("Not Autorized");

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};
