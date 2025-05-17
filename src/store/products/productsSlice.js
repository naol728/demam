import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductById } from "@/services/products";

export const getProductdata = createAsyncThunk(
  "fetch/product",
  async (productId) => {
    const data = await getProductById(productId);
    return data;
  }
);
const productSlice = createSlice({
  name: "product",
  initialState: {
    productid: null,
    productedit: null,
    loading: false,
  },
  reducers: {
    setProductId: (state, action) => {
      state.productid = action.payload;
    },
    setProduct: (state, action) => {
      console.log(action.payload.name);
      console.log(state.productedit);
      if (!state.productedit) state.productedit = {};
      state.productedit[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductdata.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductdata.fulfilled, (state, action) => {
        state.productedit = action.payload;
        state.loading = false;
      })
      .addCase(getProductdata.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setProductId, setProduct } = productSlice.actions;
export default productSlice.reducer;
