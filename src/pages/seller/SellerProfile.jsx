import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { setUser } from "@/store/user/userslice";
import { updateUser } from "@/services/user";

export default function SellerProfile() {
  const { toast } = useToast();
  const { user, loading } = useSelector((state) => state.user);
  const [profileimg, setProfileImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: (updatedUser) => updateUser(updatedUser),
    onSuccess: (data) => {
      dispatch(setUser(data));
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setProfileImg(null);
      setPreviewImg(null);
    },
    onError: (err) => {
      toast({
        title: "Update Failed",
        description: err?.message || "An error occurred while updating.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = () => {
    const updated = { ...user };
    const { name, email, phone } = updated;
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      toast({
        title: "Error",
        description: "Name should only contain letters and spaces.",
        variant: "destructive",
      });
      return;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Error",
        description: "Phone number should contain only digits (10-15 digits).",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (profileimg) updated.profileimg = profileimg;
    mutate(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setUser({ name, value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-3 px-4 py-6 max-w-md mx-auto">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="h-6 w-[180px]" />
        <Skeleton className="h-6 w-[150px]" />
      </div>
    );
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-md border rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Avatar className="w-32 h-32 border shadow-sm">
                <AvatarImage
                  src={previewImg || user.profileimg}
                  alt={user.name}
                />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={user.name || ""}
                  onChange={handleChange}
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={user.email || ""}
                  onChange={handleChange}
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="image">Profile Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleUpdate} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
