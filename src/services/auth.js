import supabase from "./supabase";

const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      throw new Error(`${error.message}`);
    }
    return data;
  } catch (err) {
    throw new Error(`${err.message}`);
  }
};

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

const signinUser = async ({ email, password }) => {
  try {
    // Check if the user exists in the "users" table
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userCheckError || !existingUser) {
      throw new Error("No user found with this email.");
    }

    // Proceed with signing in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    // Optional: check if the user exists in the "users" table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      throw new Error("User authentication succeeded, but no user data found.");
    }

    return userData; // Return the user record (including their role, etc.)
  } catch (err) {
    throw new Error(err.message);
  }
};

const signupuser = async (data) => {
  const { email, password, role, profileimg, name, phone } = data;

  try {
    // 1. Create the user in Supabase Auth
    const { data: signupData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = signupData?.user?.id;

    let profileImageUrl = null;

    if (profileimg) {
      const fileExt = profileimg.name.split(".").pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, profileimg);

      if (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      profileImageUrl = publicUrl;
    }

    const { data: userData, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          email,
          role,
          userid: userId,
          profileimg: profileImageUrl, // Save the image URL
          name,
          password,
          phone,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      throw new Error(insertError.message);
    }

    return { success: true, userData };
  } catch (error) {
    throw new Error(`Error during signup: ${error.message}`);
  }
};

export { signInWithGoogle, signinUser, signupuser, signOut };
