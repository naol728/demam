import supabase from "./supabase";

const sendOtpToEmail = async (email) => {
  const res = await supabase.auth.signInWithOtp({
    email,
  });
  if (!res) {
    throw new Error("Please try again");
  }
  return res;
};
const verifyOtp = async (email, otpCode) => {
  const res = await supabase.auth.verifyOtp({
    email,
    token: otpCode,
    type: "email",
  });
  if (!res) {
    throw new Error("Please try again");
  }

  return res;
};

const signInWithGoogle = async () => {
  const res = await supabase.auth.signInWithOAuth({
    provider: "google",
    // options: {
    //   redirectTo: "",
    // },
  });

  if (!res) {
    throw new Error("Please Try Again");
  }
  return data;
};

export { sendOtpToEmail, verifyOtp, signInWithGoogle };
