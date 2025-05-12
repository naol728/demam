import supabase from "./supabase";

const sendOtpToEmail = async (email) => {
  try {
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

export { sendOtpToEmail, verifyOtp, signInWithGoogle };
