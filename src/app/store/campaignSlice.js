import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Config/axiosInstance";
import toast from "react-hot-toast";

// Async thunk to add a new user
export const addCampaign = createAsyncThunk(
  "campaign/addCampaign",
  async ({ projectData, router, itemId2 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/campaigns/create/update`, projectData);
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
export const fetchCampaign = createAsyncThunk(
  "campaigns/fetchList",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/campaigns/list`, filters);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch user details by ID
export const fetchCampaignDetails = createAsyncThunk(
  "campaigns/fetchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/campaigns/details`, { id: userId });
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update user status
export const updateCampaignStatus = createAsyncThunk(
  "campaigns/updateCampaignStatus",
  async ({ id,project_id, status, dispatch, setDataLoading }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/campaigns_status`, { id, status });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setDataLoading(false)
        dispatch(fetchCampaign({project_id:project_id}))


      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
    list: [],
   
    campaignDetails: null,

    loading: false,
    error: null,
  },
  reducers: {
    clearcampaignDetails: (state) => {
      state.campaignDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add post
      .addCase(addCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCampaign.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch posts
      .addCase(fetchCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Store clients separately

      })
      .addCase(fetchCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch post Details
      .addCase(fetchCampaignDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaignDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.campaignDetails = action.payload;
      })
      .addCase(fetchCampaignDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update User Status
      .addCase(updateCampaignStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampaignStatus.fulfilled, (state, action) => {
        state.loading = false;
       
        if (!Array.isArray(state.list)) {
          state.list = []; // Ensure it's always an array
        }
      
        const updatedUser = action.payload;
        state.list = state.list.map(user =>
          user.id === updatedUser.id ? { ...user, status: updatedUser.status } : user
        );
      })
      .addCase(updateCampaignStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearcampaignDetails } = campaignSlice.actions;
export default campaignSlice.reducer;
