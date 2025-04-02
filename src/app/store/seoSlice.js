import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Config/axiosInstance";
import toast from "react-hot-toast";

// Async thunk to add a new user
export const addSEO = createAsyncThunk(
  "seo/addSEO",
  async ({ projectData, router,  itemId2 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/seo/create/update`, projectData);
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        router.push(`/project/details?id=${itemId2}`); // Navigate on success
        localStorage.removeItem("itemId", itemId2)
      }
      return response.data;
    } catch (error) {
      console.error("Add Post API Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch users list
export const fetchSEO = createAsyncThunk(
  "seo/fetchList",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/seo/list`, filters);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch user details by ID
export const fetchSEODetails = createAsyncThunk(
  "seo/fetchDetails",
  async (itemId2, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/seo/details`, { id: itemId2 });
      return response.data;
     
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update user status
export const updatePostStatus = createAsyncThunk(
  "seo/updateSEOStatus",
  async ({ id, status, router, section }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/seo_status`, { id, status });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
       
         
        
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const seoSlice = createSlice({
  name: "seo",
  initialState: {
    list: [], 
    employeeList: [],
    postDetails: null,
    listLoading:false,
    loading: false,
    error: null,
  },
  reducers: {
    clearpostDetails: (state) => {
      state.postDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add post
      .addCase(addSEO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSEO.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addSEO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch posts
      .addCase(fetchSEO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSEO.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Store clients separately
       
      })
      .addCase(fetchSEO.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch post Details
      .addCase(fetchSEODetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSEODetails.fulfilled, (state, action) => {
        state.loading = false;
        state.postDetails = action.payload;
      })
      .addCase(fetchSEODetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Status
      .addCase(updatePostStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePostStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.clientList = state.clientList.map(user =>
          user.id === updatedUser.id ? { ...user, status: updatedUser.status } : user
        );
        state.employeeList = state.employeeList.map(user =>
          user.id === updatedUser.id ? { ...user, status: updatedUser.status } : user
        );
      })
      .addCase(updatePostStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearpostDetails } = seoSlice.actions;
export default seoSlice.reducer;
