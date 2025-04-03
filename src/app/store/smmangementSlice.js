import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Config/axiosInstance";
import toast from "react-hot-toast";

// Async thunk to add a new user
export const addPost = createAsyncThunk(
  "seo/addPost",
  async ({ projectData, router,  itemId2 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/create/update`, projectData);
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
export const fetchPost = createAsyncThunk(
  "seo/fetchList",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/list`, filters);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch user details by ID
export const fetchPostDetails = createAsyncThunk(
  "seo/fetchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/details`, { id: userId });
      return response.data;
     
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update user status
export const updatePostStatus = createAsyncThunk(
  "seo/updatePostStatus",
  async ({ id,project_id, status, dispatch, setDataLoading}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/status`, { id, status, project_id });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setDataLoading(false)
        dispatch(fetchPost(project_id))
         
        
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePostApprovalStatus = createAsyncThunk(
  "seo/updatePostApprovalStatus",
  async ({ id ,project_id, approval_status, dispatch, setDataLoading }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/post/approvalstatus`, { id, approval_status, project_id });
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setDataLoading(false)
        dispatch(fetchPost(project_id))
         
        
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState: {
    list: [], 
    postDetails: null,
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
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch posts
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Store clients separately
       
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch post Details
      .addCase(fetchPostDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.postDetails = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Post Status
      .addCase(updatePostStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePostStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.list)) {
          console.error("state.list is not an array:", state.list);
          return;
        }
        
        const updatedUser = action.payload;
       
        state.list = Array.isArray(state.list)
        ? state.list.map(user =>
            user.id === updatedUser.id ? { ...user, status: updatedUser.status } : user
          )
        : [];
      
      })
      .addCase(updatePostStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Post Approval Status
      .addCase(updatePostApprovalStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePostApprovalStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        if (!Array.isArray(state.list)) {
          console.error("state.list is not an array:", state.list);
          return;
        }
        
        state.list = Array.isArray(state.list)
        ? state.list.map(user =>
            user.id === updatedUser.id ? { ...user, approval_status: updatedUser.approval_status } : user
          )
        : [];
      
      
      })
      .addCase(updatePostApprovalStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearpostDetails } = postSlice.actions;
export default postSlice.reducer;
