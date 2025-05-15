import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/services/supabase";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { setUser } from "@/store/user/userslice";
import { updateUser } from "@/services/user";

export default function SellerProfile() {
  const { toast } = useToast();
  const { user, loading } = useSelector((state) => state.user);
  const [profileimg, setProfileImg] = useState();
  const { mutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: (updateduserdata) => updateUser(updateduserdata),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "sucessfuly updated",
      });
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
  const dispatch = useDispatch();
  const handleUpdate = () => {
    let updateduserdata = { ...user };

    if (profileimg) updateduserdata = { ...user, profileimg };
    console.log(updateduserdata);
    mutate(updateduserdata);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setUser({ name, value }));
  };
  if (loading)
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  return (
    <section className="py-12">
      <div className="container max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex justify-center items-center ">
                <Avatar className="size-40">
                  <AvatarImage src={user.profileimg} alt="Profile image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={user.address}
                  // disabled={!editing}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block mb-1">Profile Image</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImg(e.target.files[0])}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                onClick={handleUpdate}
                // disabled={loading}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
