import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Config/axiosInstance";
import toast from "react-hot-toast";

// Async thunk to add a new user
export const addcollabration = createAsyncThunk(
  "collabration/addcollabration",
  async ({ projectData, router,  itemId2 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/collaboration/create/update`, projectData);
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
export const fetchcollabration = createAsyncThunk(
  "collabrations/fetchList",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/collaboration/list`, filters);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch user details by ID
export const fetchcollabrationDetails = createAsyncThunk(
  "collabrations/fetchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/collaboration/details`, { id: userId });
      return response.data;
     
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update user status
export const updatePostStatus = createAsyncThunk(
  "collabrations/updateSEOStatus",
  async ({ id, status, router, section }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/status`, { id, status });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
       
         
        
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const collabrationSlice = createSlice({
  name: "collabration",
  initialState: {
    list: [], 
    employeeList: [],
    collabrationDetails: null,
    listLoading:false,
    loading: false,
    error: null,
  },
  reducers: {
    clearcollabrationDetails: (state) => {
      state.collabrationDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add post
      .addCase(addcollabration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addcollabration.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addcollabration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch posts
      .addCase(fetchcollabration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcollabration.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Store clients separately
       
      })
      .addCase(fetchcollabration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch post Details
      .addCase(fetchcollabrationDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcollabrationDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.collabrationDetails = action.payload;
      })
      .addCase(fetchcollabrationDetails.rejected, (state, action) => {
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

export const { clearcollabrationDetails } = collabrationSlice.actions;
export default collabrationSlice.reducer;
