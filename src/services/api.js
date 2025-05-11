import supabase from "./supabase";

const getProducts = async () => {
  const { data } = await supabase.from("Products").select();
  return data;
};

export { getProducts };
