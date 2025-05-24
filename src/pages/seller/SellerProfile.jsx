import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationKey: ["user"],
    mutationFn: (updateduserdata) => updateUser(updateduserdata),
    onSuccess: (data) => {
      dispatch(setUser(data));
      toast({
        title: "Success",
        description: "Successfully updated your profile.",
      });
      setProfileImg(null); // clear selected file
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err?.message || "An error occurred while updating.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = () => {
    let updateduserdata = { ...user };
    if (profileimg) updateduserdata.profileimg = profileimg;
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
              <div className="flex justify-center items-center">
                <Avatar className="size-40">
                  <AvatarImage src={user.profileimg} alt="Profile image" />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={user.name || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={user.email || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={user.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={user.address || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="block mb-1">Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileImg(e.target.files[0])}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" onClick={handleUpdate} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
