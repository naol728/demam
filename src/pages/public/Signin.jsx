import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle, signinUser } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import supabase from "../../services/supabase";
import { GalleryVerticalEnd } from "lucide-react";
import { fetchUser } from "@/store/user/userslice";

export default function Signin() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, Loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [roleChecked, setRoleChecked] = useState(false);
  const diaptch = useDispatch();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => signinUser(data),
    mutationKey: ["auth"],
    onSuccess: async () => {
      toast({
        title: "Sign in successful",
        description: "You have successfully signed in!",
      });
      diaptch(fetchUser());
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.message || "An unexpected error occurred during sign in.",
        variant: "destructive",
      });
    },
  });

  const handlesignin = async (e) => {
    e.preventDefault();
    const data = { email, password };
    await mutateAsync(data);
  };

  const handlesigninwithgoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast({
        title: "Failed",
        description:
          err?.message || "An unexpected error occurred during Sign In.",
        variant: "destructive",
      });
    }
  };

  if (user) return <Navigate to="/" replace={true} />;
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Demam Platform
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <section className="py-32 flex justify-center items-center min-h-screen">
              <div className="container">
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="mx-auto w-full max-w-sm  rounded-md p-6 shadow">
                    <div className="mb-6 flex flex-col items-center">
                      <Link to="/" className="mb-6 flex items-center gap-2">
                        <img src="" className="max-h-8" alt="" />
                      </Link>
                      <h1 className="mb-2 text-2xl font-bold">
                        Demam Platform
                      </h1>
                      <p className="text-muted-foreground">
                        Please Sign In To Demam Platform
                      </p>
                    </div>
                    <div>
                      <form onSubmit={handlesignin} className="grid gap-4">
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                          type="submit"
                          disabled={isPending}
                          className="mt-2 w-full"
                        >
                          {isPending ? "Signing" : "Sign In"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handlesigninwithgoogle}
                          disabled
                        >
                          <FcGoogle className="mr-2 size-5" />
                          Sign In with Google
                        </Button>
                      </form>

                      <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                        <p>I don’t have an account</p>
                        <Link to="/signup" className="font-medium text-primary">
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login2.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6] "
        />
      </div>
    </div>
  );
}
