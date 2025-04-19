import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaUser, FaEnvelope, FaPhone, FaCamera } from "react-icons/fa";
import {
  updateDetails,
  updatePassword,
  uploadProfilePhoto,
} from "../../redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.user.profilePhoto) {
      setPreviewUrl(user.user.profilePhoto);
    }
  }, [user, navigate]);

  const profileValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleProfileSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(updateDetails(values)).unwrap();
      setStatusMessage({
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error.message || "Failed to update profile",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { currentPassword, newPassword } = values;
      await dispatch(updatePassword({ currentPassword, newPassword })).unwrap();
      setStatusMessage({
        type: "success",
        message: "Password updated successfully",
      });
      resetForm();
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error.message || "Failed to update password",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!profilePhoto) return;

    try {
      const formData = new FormData();
      formData.append("file", profilePhoto);

      await dispatch(uploadProfilePhoto(formData)).unwrap();

      setStatusMessage({
        type: "success",
        message: "Profile photo updated successfully",
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        message: error.message || "Failed to update profile photo",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <FaUser className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-photo"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer"
                >
                  <FaCamera className="text-blue-600" />
                  <input
                    type="file"
                    id="profile-photo"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
                {profilePhoto && (
                  <button
                    onClick={handlePhotoUpload}
                    className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  >
                    Save Photo
                  </button>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">
                  {user.user.name}
                </h1>
                <p className="text-blue-100">{user.user.email}</p>
                <p className="text-blue-100 mt-1">
                  {user.user.role.charAt(0).toUpperCase() +
                    user.user.role.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                Profile Information
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "password"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </button>
            </nav>
          </div>

          {/* Status Message */}
          {statusMessage.message && (
            <div
              className={`p-4 ${
                statusMessage.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" ? (
              <Formik
                initialValues={{
                  name: user.user.name || "",
                  email: user.user.email || "",
                  mobile: user.user.mobile || "",
                }}
                validationSchema={profileValidationSchema}
                onSubmit={handleProfileSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="text-gray-400" />
                        </div>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mobile Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="mobile"
                          id="mobile"
                          className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <ErrorMessage
                        name="mobile"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={passwordValidationSchema}
                onSubmit={handlePasswordSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <Field
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="currentPassword"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <Field
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isSubmitting ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
