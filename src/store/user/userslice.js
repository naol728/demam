import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "./../../services/supabase";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role,profileimg")
    .eq("userid", userId)
    .single();

  if (error) throw error;
  return data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    role: localStorage.getItem("user_role") || null,
    loading: false,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      localStorage.removeItem("user_role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload?.role || null;
        state.loading = false;
        if (action.payload?.role) {
          localStorage.setItem("user_role", action.payload.role);
        }
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
