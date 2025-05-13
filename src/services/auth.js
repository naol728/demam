import supabase from "./supabase";

const sendOtpToEmail = async (email) => {
  try {
    const { data: userdata, error: err } = await supabase
      .from("users")
      .select("*")
      .eq("email", { email })
      .single();

    // if (err && err.code !== "PGRST116") {
    //   throw new Error(err.message);
    // }

    if (userdata) {
      throw new Error("A user already exists with this email.");
    }

    const { error, data } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw new Error(`${err.message}`);
  }
};

const verifyOtp = async ({ email, token }) => {
  try {
    const { error, data } = await supabase.auth.verifyOtp({
      email,
      token: token,
      type: "email",
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw new Error(`${err.message}`);
  }
};

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

async function getCurrentUserId() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      throw new Error("No authenticated user found.");
    }

    return session.user.id;
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function getCurrentUserFromDB() {
  try {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from("users") // Your table name in Supabase
      .select("*")
      .eq("id", userId)
      .single(); // Get a single user record

    if (error || !data) {
      throw new Error("Failed to fetch user data.");
    }

    return data; // contains user fields like id, email, role, etc.
  } catch (err) {
    console.error("Error fetching current user from DB:", err.message);
    throw new Error(err.message);
  }
}
async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
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
  const { email, password, role, profileimg, name } = data;

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
    console.log(userId);
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
          email,
          role,
          userid: userId,
          profileimg: profileImageUrl, // Save the image URL
          name,
          password,
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

export {
  sendOtpToEmail,
  verifyOtp,
  signInWithGoogle,
  getCurrentUserId,
  signinUser,
  signupuser,
  signOut,
};
