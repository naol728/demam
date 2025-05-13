import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { addUser, getCurrentUserFromDB } from "@/services/user";
import { Navigate, useNavigate } from "react-router";
import { getCurrentUserId } from "@/services/auth";

export default function Register() {
  const userid = getCurrentUserId();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    role: "",
    profileImage: null,
  });
  const [user, setUser] = useState();
  useEffect(() => {
    async function fetchuser() {
      const data = await getCurrentUserFromDB();
      setUser(data);
    }
    fetchuser();
  }, []);

  const { mutateAsync } = useMutation({
    mutationFn: (form) => addUser(form),
    mutationKey: ["register"],
    onSuccess: (data, _, context) => {
      toast({
        title: "Sucess",
        description: " successfuly registerd",
      });
      console.log(data);

      if (data[0].role === "merchant") {
        navigate("/products");
      }
      if (data[0].role === "seller") {
        navigate("/myproducts");
      }
    },
    onError: (error, variables) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setForm((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRoleChange = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.profileImage) {
      toast({ title: "Error", description: "Please fill in all fields." });
      return;
    }
    await mutateAsync(form);
  };

  if (!userid) return <Navigate to="/signup" replace />;
  if (user?.userid) return <Navigate to="/" replace />;

  return (
    <section className="py-16 flex justify-center items-center min-h-screen">
      <div className="container max-w-lg mx-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="merchant">Merchant</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profileImage">Profile Image</Label>
            <Input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </div>
    </section>
  );
}
