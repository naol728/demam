import supabase from "./supabase";
export const getCatagories = async () => {
  try {
    const categories = await supabase.from("categories").select("*");
    return categories;
  } catch (err) {
    throw new Error(err.message);
  }
};
