import { configureStore } from "@reduxjs/toolkit";
import addslice from "../Reducers/apicall"


export const store = configureStore({
    reducer: {
        Addcustomer: addslice
    },
});