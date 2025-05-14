import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle, signinUser } from "@/services/auth";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import supabase from "../../services/supabase"; // make sure path is correct

export default function Signin() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, Loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [roleChecked, setRoleChecked] = useState(false); // to prevent flicker

  const { mutateAsync } = useMutation({
    mutationFn: (data) => signinUser(data),
    mutationKey: ["auth"],
    onSuccess: async () => {
      toast({
        title: "Sign in successful",
        description: "You have successfully signed in!",
      });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const userId = session?.user?.id;

      if (userId) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", userId)
          .single();

        if (!error && data?.role) {
          if (data.role === "seller") {
            navigate("/dashboard/products");
          } else if (data.role === "merchant") {
            navigate("/products");
          } else {
            navigate("/");
          }
        } else {
          navigate("/"); // fallback
        }
      }

      setRoleChecked(true);
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
    <section className="py-32 flex justify-center items-center min-h-screen">
      <div className="container">
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="mx-auto w-full max-w-sm  rounded-md p-6 shadow">
            <div className="mb-6 flex flex-col items-center">
              <Link to="/" className="mb-6 flex items-center gap-2">
                <img src="" className="max-h-8" alt="" />
              </Link>
              <h1 className="mb-2 text-2xl font-bold">Demam Platform</h1>
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

                <Button type="submit" className="mt-2 w-full">
                  Sign In
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handlesigninwithgoogle}
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
  );
}
