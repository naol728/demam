import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  sendOtpToEmail,
  verifyOtp,
  signInWithGoogle,
  getCurrentUserId,
} from "@/services/auth";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate, useNavigate } from "react-router";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function SignUp() {
  const userid = getCurrentUserId();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const naviagate = useNavigate();

  const { isLoading: emailsending, mutate: sendotptoemailfn } = useMutation({
    mutationFn: (email) => sendOtpToEmail(email),
    mutationKey: ["auth", "send-otp"],
    onSuccess: () => {
      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Sending OTP",
        description: error?.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });
  const { isLoading: otpvarifying, mutate: otpvarifyfn } = useMutation({
    mutationFn: (otp) => verifyOtp(otp),
    mutationKey: ["auth", "verify-otp"],
    onSuccess: () => {
      toast({
        title: "OTP Verified",
        description: "You're now signed in!",
      });
      naviagate("/register");
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description:
          error?.message || "An unexpected error occurred during verification.",
        variant: "destructive",
      });
    },
  });

  const handlesendotp = () => {
    if (!email) return;
    sendotptoemailfn(email);
  };

  const handlesigninwithgoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast({
        title: "Failed",
        description:
          err?.message || "An unexpected error occurred during Sign UP.",
        variant: "destructive",
      });
    }
  };

  if (userid) return <Navigate to="/" replace />;

  if (otpvarifying || emailsending) return <Loading />;

  return (
    <section className="py-32 flex justify-center items-center min-h-screen">
      <div className="container">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="mx-auto w-full max-w-sm  rounded-md p-6 shadow">
            {otpSent ? (
              <div className="space-y-4">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                <Button
                  className="w-full"
                  disabled={otp.length !== 6 || otpvarifying}
                  onClick={() => otpvarifyfn({ email, token: otp })}
                >
                  {otpvarifying ? "Varifying..." : "Verify Code"}
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-col items-center">
                  <Link href="#" className="mb-6 flex items-center gap-2">
                    <img src="" className="max-h-8" alt="" />
                  </Link>
                  <h1 className="mb-2 text-2xl font-bold">Demam Platform</h1>
                  <p className="text-muted-foreground">
                    Please Sign Up To Demam Platform
                  </p>
                </div>
                <div>
                  <div className="grid gap-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                      type="submit"
                      className="mt-2 w-full"
                      onClick={handlesendotp}
                      disabled={emailsending}
                    >
                      {emailsending ? "Sending OTP" : "Send OTP"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handlesigninwithgoogle}
                    >
                      <FcGoogle className="mr-2 size-5" />
                      Sign Up with Google
                    </Button>
                  </div>

                  <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                    <p>i have an account</p>
                    <Link to="/signin" className="font-medium text-primary">
                      Sign In
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
