import supabase from "./supabase";

export async function addUser({ name, role, profileImage }) {
  try {
    if (!name || !role || !profileImage) {
      throw new Error("All fields are required.");
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      throw new Error("No authenticated user found.");
    }

    const userId = session.user.id;

    const fileExt = profileImage.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, profileImage);

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      throw new Error("Failed to upload profile image.");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { data, error } = await supabase
      .from("users")
      .insert([{ userid: userId, name, role, profileimg: publicUrl }])
      .select();

    if (error) {
      console.error("Insert error:", error);
      throw new Error(error.message || "Failed to insert user.");
    }

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function getCurrentUserFromDB() {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("Not authenticated");
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("userid", user.id)
      .single();

    if (error) {
      throw new Error("User not found in DB");
    }

    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}
