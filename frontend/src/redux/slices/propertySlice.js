import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/properties`;

const initialState = {
  properties: [],
  property: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  pagination: null,
  totalCount: 0,
};

// Get all properties
export const getProperties = createAsyncThunk(
  "property/getAll",
  async (queryParams, thunkAPI) => {
    try {
      // Build query string from params
      const queryString = queryParams
        ? Object.keys(queryParams)
            .map((key) => `${key}=${queryParams[key]}`)
            .join("&")
        : "";

      const response = await axios.get(`${API_URL}?${queryString}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single property
export const getProperty = createAsyncThunk(
  "property/getOne",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create property
export const createProperty = createAsyncThunk(
  "property/create",
  async (propertyData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await axios.post(API_URL, propertyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update property
export const updateProperty = createAsyncThunk(
  "property/update",
  async ({ id, propertyData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/${id}`,
        propertyData,
        config
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete property
export const deleteProperty = createAsyncThunk(
  "property/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload property image
export const uploadPropertyImage = createAsyncThunk(
  "property/uploadImage",
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/${id}/images`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get properties in radius
export const getPropertiesInRadius = createAsyncThunk(
  "property/getInRadius",
  async ({ zipcode, distance }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/radius/${zipcode}/${distance}`
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearProperty: (state) => {
      state.property = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all properties
      .addCase(getProperties.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        console.log("getProperties.fulfilled payload:", action.payload);
        state.properties = action.payload.data;
        state.pagination = action.payload.pagination;
        state.totalCount = action.payload.count;
      })
      .addCase(getProperties.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get single property
      .addCase(getProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.property = action.payload.data;
      })
      .addCase(getProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create property
      .addCase(createProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties.push(action.payload.data);
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.map((property) =>
          property._id === action.payload.data._id
            ? action.payload.data
            : property
        );
        state.property = action.payload.data;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = state.properties.filter(
          (property) => property._id !== action.payload
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Upload property image
      .addCase(uploadPropertyImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadPropertyImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.property = action.payload.data;
      })
      .addCase(uploadPropertyImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get properties in radius
      .addCase(getPropertiesInRadius.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPropertiesInRadius.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.properties = action.payload.data;
        state.totalCount = action.payload.count;
      })
      .addCase(getPropertiesInRadius.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearProperty } = propertySlice.actions;
export default propertySlice.reducer;
