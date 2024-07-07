import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; //createAsyncThunk handle asynconomous function 
import axios from "axios";
import { toast } from "react-toastify";

// My API 
const apiurl = 'http://localhost:3003/customer'


// Call Api for Add Product
export const addcustomer = createAsyncThunk("addcustomer", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(apiurl, data);
        console.log("Fetching Add Customer data", response);
        toast.success("Customer Added Successfully")
        return response.data;
    } catch (error) {
        console.log("Error Fetching Add Product data", error);
        toast.error("Customer Is Not Added ")
        return rejectWithValue(error.response.data);
    }
});

// Slice Area 
// createSlice area start
const addslice = createSlice({
    name: "add",
    initialState: {
        addsss: [],
        loading: false,
        error: null,
    },


    extraReducers: (builder) => {
        builder
            // Create User
            .addCase(addcustomer.pending, (state) => {
                state.loading = true;
            })
            .addCase(addcustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.addsss.push(action.payload);

            })
            .addCase(addcustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    },
});

export default addslice.reducer;


// Call Api for Show All Product
export const showcustomer = createAsyncThunk("showcustomer", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(apiurl);
        console.log("Fetching Show Customer data", response);
        return response?.data;
    } catch (error) {
        console.log("Error Fetching Show Customer data", error);
        return rejectWithValue(error.response.data);
    }
});

// Call Api for Details Customer
export const detailscustomer = createAsyncThunk("detailscustomer", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${apiurl}/${id}`)
        console.log("Fetching Details data", response);
        return response?.data;
    } catch (error) {
        console.log("Error Fetching Details data", error);
        return rejectWithValue(error.response.data);
    }
});


// Call Api for Delete Product
export const deletecustomer = createAsyncThunk("deletecustomer", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${apiurl}/${id}`)
        console.log("Fetching Delete Customer data", response);
        return response?.data
    } catch (error) {
        console.log("Error Fetching Delete Customer data", error);
        toast.error(error?.response?.data?.message)
        return rejectWithValue(error.response.data);
    }
});


// Call Api for Edit Product
export const editcustomer = createAsyncThunk("editcustomer", async ({ data, id }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${apiurl}/${id}`, data);
        console.log("Fetching Edit Customer data", response);
        toast.success("Edit Customer Successfully");
        return response?.data;
    } catch (error) {
        console.log("Error Fetching Edit Customer data", error);
        toast.error("Edit Is Not Make");
        return rejectWithValue(error.response.data);
    }
});


