import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userslice";
import productReducer from "./products/productsSlice";
import PopUpreducer from "./popup";

export const store = configureStore({
  reducer: {
    user: userReducer,
    Products: productReducer,
    popup: PopUpreducer,
  },
});
