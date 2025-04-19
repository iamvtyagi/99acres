import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Register user
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      console.log("Registering user with data:", {
        ...userData,
        password: "[REDACTED]",
      });
      console.log("API URL:", `${API_URL}/register`);

      // Validate required fields
      const requiredFields = [
        "name",
        "username",
        "email",
        "mobile",
        "password",
      ];
      for (const field of requiredFields) {
        if (!userData[field]) {
          return thunkAPI.rejectWithValue(`${field} is required`);
        }
      }

      // Add a timeout to the axios request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      try {
        const response = await axios.post(`${API_URL}/register`, userData, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });
        clearTimeout(timeoutId);
        console.log("Register response:", response.data);

        // If registration is successful and we get a token back, store it
        if (response.data && response.data.success && response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      } catch (axiosError) {
        clearTimeout(timeoutId);
        throw axiosError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.error("Register error:", error);

      // Handle abort error (timeout)
      if (error.name === "AbortError" || error.code === "ECONNABORTED") {
        return thunkAPI.rejectWithValue("Request timed out. Please try again.");
      }

      // Handle duplicate key errors
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message &&
        (error.response.data.message.includes("already registered") ||
          error.response.data.message.includes("already taken"))
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }

      // Handle validation errors
      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue(
          error.response.data.message || "Validation error"
        );
      }

      // Handle server connection errors
      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        return thunkAPI.rejectWithValue(
          "Server is not responding. Please try again later."
        );
      }

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

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      console.log("Logging in user with data:", {
        ...userData,
        password: "[REDACTED]",
      });
      console.log("API URL:", `${API_URL}/login`);

      // Make sure we have the required fields
      if (!userData.email || !userData.password) {
        return thunkAPI.rejectWithValue(
          "Please provide email/username and password"
        );
      }

      // Add a timeout to the axios request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

      try {
        const response = await axios.post(`${API_URL}/login`, userData, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });
        clearTimeout(timeoutId);
        console.log("Login response:", response.data);

        if (response.data && response.data.success) {
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(response.data));
          return response.data;
        } else {
          // Handle unexpected response format
          return thunkAPI.rejectWithValue("Invalid response from server");
        }
      } catch (axiosError) {
        clearTimeout(timeoutId);
        throw axiosError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle abort error (timeout)
      if (error.name === "AbortError" || error.code === "ECONNABORTED") {
        return thunkAPI.rejectWithValue("Request timed out. Please try again.");
      }

      // Handle different error scenarios
      if (error.response && error.response.status === 401) {
        return thunkAPI.rejectWithValue("Invalid credentials");
      }

      if (error.response && error.response.status === 400) {
        return thunkAPI.rejectWithValue(
          error.response.data.message || "Bad request"
        );
      }

      if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
        return thunkAPI.rejectWithValue(
          "Server is not responding. Please try again later."
        );
      }

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

// Logout user
export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
});

// Verify email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/verify-email/${token}`);

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

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

// Forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
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

// Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/reset-password/${token}`, {
        password,
      });

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

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

// Update user details
export const updateDetails = createAsyncThunk(
  "auth/updateDetails",
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/update-details`,
        userData,
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

// Update password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/update-password`,
        passwordData,
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

// Upload profile photo
export const uploadProfilePhoto = createAsyncThunk(
  "auth/uploadProfilePhoto",
  async (photoData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.put(
        `${API_URL}/upload-photo`,
        photoData,
        config
      );

      // Update user in localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      currentUser.user = response.data.data;
      localStorage.setItem("user", JSON.stringify(currentUser));

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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Details
      .addCase(updateDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = {
          ...state.user,
          user: action.payload.data,
        };
      })
      .addCase(updateDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Upload Profile Photo
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = {
          ...state.user,
          user: action.payload.data,
        };
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
