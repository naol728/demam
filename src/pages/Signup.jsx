import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { sendOtpToEmail, verifyOtp, signInWithGoogle } from "@/services/auth";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function SignUp() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const {
    data: sendemail,
    isLoading: emailsending,
    mutate: sendotptoemailfn,
  } = useMutation({
    mutationFn: (email) => sendOtpToEmail(email),
    mutationKey: ["auth"],
    onSuccess: () => {
      setOtpSent(true);
      toast({
        title: "Sucesss",
        description: "Magic link sent Sucessfully",
      });
    },
    onError: () => {
      setOtpSent(false);
      toast({
        title: "Error",
        description: "something went wrong",
      });
    },
  });
  const {
    data: varifyotp,
    isLoading: otpvarifying,
    mutate: otpvarifyfn,
  } = useMutation({
    mutationFn: (otp) => verifyOtp(otp),
    mutationKey: ["auth"],
  });

  const handlesendotp = () => {
    if (!email) return;
    sendotptoemailfn(email);
  };

  const handlevarifyotp = () => {
    if (!otp) return;
    otpvarifyfn(email, otp);
  };
  const handlesigninwithgoogle = () => {
    signInWithGoogle();
  };

  if (otpvarifying || emailsending) return <Loading />;

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="mx-auto w-full max-w-sm  rounded-md p-6 shadow">
            {otpSent ? (
              <div>We have sent a magic link to your email go to email</div>
            ) : (
              <>
                <div className="mb-6 flex flex-col items-center">
                  <a href="#" className="mb-6 flex items-center gap-2">
                    <img src="" className="max-h-8" alt="" />
                  </a>
                  <h1 className="mb-2 text-2xl font-bold">Demam</h1>
                  <p className="text-muted-foreground">
                    Please Sign Up To Demam{" "}
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
                    >
                      send otp
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
                    <a href="#" className="font-medium text-primary">
                      Sign In
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
}
