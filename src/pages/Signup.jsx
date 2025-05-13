import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupuser } from "@/services/auth";
import Loading from "@/components/Loading";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate, useNavigate } from "react-router";
import { useSelector } from "react-redux";

export default function SignUp() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("merchant");
  const [profileimg, setProfileImg] = useState(null);
  const [phone, setPhone] = useState("");
  const { user, Loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: (data) => signupuser(data),
    mutationKey: ["auth"],
    onSuccess: (data) => {
      toast({
        title: "Sign up successful",
        description: "You have successfully signed up!",
      });
      navigate("/");
      console.log(data);
    },
    onError: (err) => {
      toast({
        title: "Error",
        description:
          err?.message || "An unexpected error occurred during sign up.",
        variant: "destructive",
      });
    },
  });

  const handlesignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !role || !profileimg || !name) {
      toast({
        title: "Error",
        description: "please fill all filds",
        variant: "destructive",
      });
      return;
    }
    const data = { email, password, role, profileimg, name };
    await mutateAsync(data);
  };

  if (Loading) return <Loading />;

  if (user) return <Navigate to="/" replace={true} />;

  return (
    <section className=" flex justify-center items-center ">
      <div className="container">
        <div className="flex flex-col items-center justify-center  gap-4">
          <form
            onSubmit={handlesignup}
            className="mx-auto w-full max-w-sm rounded-md p-6 shadow"
          >
            <div className="mb-6 flex flex-col items-center">
              <Link href="#" className="mb-6 flex items-center gap-2">
                <img src="" className="max-h-8" alt="" />
              </Link>
              <h1 className="mb-2 text-2xl font-bold">Demam Platform</h1>
              <p className="text-muted-foreground">
                Please Sign Up To Demam Platform
              </p>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="block mb-1"> FULL Name</label>

                <Input
                  type="text"
                  placeholder="Enter your Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1"> Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1"> Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label className="block mb-1">Phone Number</label>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="+251912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="focus-visible:ring-primary"
                />
              </div>
              {/* Profile Image Input */}
              <div>
                <label className="block mb-1">Profile Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImg(e.target.files[0])}
                />
              </div>

              {/* Role selection */}
              <div className="mt-2">
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Select Role:
                </label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="seller">Seller</option>
                  <option value="merchant">Merchant</option>
                </select>
              </div>

              <Button
                type="submit"
                className="mt-2 w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>

              <Button variant="outline" className="w-full" disabled>
                <FcGoogle className="mr-2 size-5" />
                Sign Up with Google
              </Button>
            </div>

            <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
              <p>I have an account</p>
              <Link to="/signin" className="font-medium text-primary">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
