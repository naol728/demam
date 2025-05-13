// layout/Protectedroute.jsx or .tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import supabase from "../services/supabase";
import Loading from "@/components/Loading";

export default function Protectedroute({ role }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const { data: user, error } = await supabase
        .from("users")
        .select("role")
        .eq("userid", session.user.id)
        .single();

      if (error || !user) {
        setUserRole(null);
      } else {
        setUserRole(user.role);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <Loading />;

  if (userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
