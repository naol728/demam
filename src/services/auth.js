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

const signinuser = async (email) => {
  try {
    const { data: user, error: err } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    // if (err) {
    //   throw new Error(err.message);
    // }

    if (!user) {
      throw new Error("A user does not exist with this email. ");
    }
    const { error, data } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export {
  sendOtpToEmail,
  verifyOtp,
  signInWithGoogle,
  getCurrentUserId,
  signinuser,
};
