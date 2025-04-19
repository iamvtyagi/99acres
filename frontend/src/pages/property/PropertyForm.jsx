import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
  getProperty,
  createProperty,
  updateProperty,
  uploadPropertyImage,
} from "../../redux/slices/propertySlice";
import { FaPlus, FaMinus, FaUpload, FaTrash } from "react-icons/fa";
import Dropzone from "react-dropzone";

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { property, isLoading, isSuccess } = useSelector(
    (state) => state.property
  );
  const { user } = useSelector((state) => state.auth);

  // Check if user can post property
  const canPostProperty =
    user && ["seller", "agent", "admin"].includes(user.user.role);

  useEffect(() => {
    if (!canPostProperty) {
      navigate("/profile");
    }
  }, [canPostProperty, navigate]);

  if (!canPostProperty) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Permission Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be a seller or agent to post properties. Please update
            your role in your profile.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(100, "Title cannot be more than 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .max(2000, "Description cannot be more than 2000 characters"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    status: Yup.string()
      .required("Status is required")
      .oneOf(["rent", "sale"], "Invalid status"),
    type: Yup.string()
      .required("Property type is required")
      .oneOf(
        ["flat", "house", "villa", "plot", "commercial", "office", "shop"],
        "Invalid property type"
      ),
    size: Yup.number()
      .required("Size is required")
      .positive("Size must be positive"),
    bedrooms: Yup.number()
      .min(0, "Bedrooms cannot be negative")
      .when("type", {
        is: (type) => {
          return type !== "plot" && type !== "commercial" && type !== "shop";
        },
        then: () => Yup.number().required("Bedrooms is required"),
        otherwise: () => Yup.number().nullable(),
      }),
    bathrooms: Yup.number()
      .min(0, "Bathrooms cannot be negative")
      .when("type", {
        is: (type) => {
          return type !== "plot" && type !== "commercial" && type !== "shop";
        },
        then: () => Yup.number().required("Bathrooms is required"),
        otherwise: () => Yup.number().nullable(),
      }),
    "location.address": Yup.string().required("Address is required"),
    "location.city": Yup.string().required("City is required"),
    "location.state": Yup.string().required("State is required"),
    "location.pincode": Yup.string()
      .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits"),
  });

  // Initial form values
  const initialValues = {
    title: "",
    description: "",
    price: "",
    status: "sale",
    type: "flat",
    size: "",
    bedrooms: "",
    bathrooms: "",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      coordinates: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
    amenities: [],
    images: [],
  };

  useEffect(() => {
    // Check if it's an edit form
    if (id) {
      setIsEdit(true);
      dispatch(getProperty(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Populate form with property data if editing
    if (isEdit && property) {
      setUploadedImages(property.images || []);
    }
  }, [isEdit, property]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus({ isSubmitting: true, message: "Saving property..." });
      let propertyId = id;

      // Create or update property
      if (isEdit) {
        const result = await dispatch(
          updateProperty({ id: propertyId, propertyData: values })
        ).unwrap();
        propertyId = result.data._id;
        setStatus({
          isSubmitting: true,
          message: "Property updated successfully!",
        });
      } else {
        const result = await dispatch(createProperty(values)).unwrap();
        propertyId = result.data._id;
        setStatus({
          isSubmitting: true,
          message: "Property created successfully!",
        });
      }

      // Upload images if any
      if (uploadedImages.length > 0) {
        // Filter out images that are already uploaded (have URLs)
        const newImages = uploadedImages.filter(
          (img) => typeof img !== "string"
        );

        if (newImages.length > 0) {
          setUploadProgress(1); // Start progress
          setStatus({ isSubmitting: true, message: "Uploading images..." });

          // Upload images one by one
          for (let i = 0; i < newImages.length; i++) {
            try {
              const formData = new FormData();
              // Make sure to use the correct field name that the backend expects
              formData.append("file", newImages[i]);

              // Log the form data for debugging
              console.log(
                `Uploading image ${i + 1}/${newImages.length}:`,
                newImages[i].name
              );

              const result = await dispatch(
                uploadPropertyImage({ id: propertyId, formData })
              ).unwrap();

              console.log("Upload result:", result);

              // Update progress
              setUploadProgress(((i + 1) / newImages.length) * 100);
              setStatus({
                isSubmitting: true,
                message: `Uploading images (${Math.round(
                  ((i + 1) / newImages.length) * 100
                )}%)`,
              });
            } catch (uploadError) {
              console.error(`Error uploading image ${i}:`, uploadError);
              alert(
                `Failed to upload image ${newImages[i].name}: ${
                  uploadError.message || "Unknown error"
                }`
              );
              // Continue with next image even if one fails
            }
          }

          setStatus({
            isSubmitting: true,
            message: "Images uploaded successfully!",
          });
        }
      }

      // Small delay to show success message before redirecting
      setTimeout(() => {
        // Navigate to property detail page
        navigate(`/properties/${propertyId}`);
      }, 1000);
    } catch (error) {
      console.error("Error submitting property:", error);
      setStatus({
        isSubmitting: false,
        error: error.message || "Failed to save property. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image drop
  const handleDrop = (acceptedFiles) => {
    // Validate file types and sizes
    const validFiles = acceptedFiles.filter((file) => {
      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        alert(`File ${file.name} is not an image`);
        return false;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 5MB)`);
        return false;
      }

      return true;
    });

    // Add valid files to state
    setUploadedImages((prev) => [...prev, ...validFiles]);
  };

  // Remove image
  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Check if property exists when editing
  if (isEdit && isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <svg
          className="animate-spin h-12 w-12 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? "Edit Property" : "Post a New Property"}
          </h1>

          <Formik
            initialValues={
              isEdit && property
                ? {
                    title: property.title || "",
                    description: property.description || "",
                    price: property.price || "",
                    status: property.status || "sale",
                    type: property.type || "flat",
                    size: property.size || "",
                    bedrooms: property.bedrooms || "",
                    bathrooms: property.bathrooms || "",
                    location: {
                      address: property.location?.address || "",
                      city: property.location?.city || "",
                      state: property.location?.state || "",
                      pincode: property.location?.pincode || "",
                      coordinates: property.location?.coordinates || {
                        type: "Point",
                        coordinates: [0, 0],
                      },
                    },
                    amenities: property.amenities || [],
                    images: property.images || [],
                  }
                : initialValues
            }
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, isSubmitting, setFieldValue, status }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <Field
                        type="text"
                        name="title"
                        id="title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="title"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price (₹)
                      </label>
                      <Field
                        type="number"
                        name="price"
                        id="price"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="price"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Property For
                      </label>
                      <Field
                        as="select"
                        name="status"
                        id="status"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Property Type
                      </label>
                      <Field
                        as="select"
                        name="type"
                        id="type"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="flat">Flat/Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="plot">Plot/Land</option>
                        <option value="commercial">Commercial</option>
                        <option value="office">Office Space</option>
                        <option value="shop">Shop/Showroom</option>
                      </Field>
                      <ErrorMessage
                        name="type"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Property Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="size"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Size (sq.ft)
                      </label>
                      <Field
                        type="number"
                        name="size"
                        id="size"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="size"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    {values.type !== "plot" &&
                      values.type !== "commercial" &&
                      values.type !== "shop" && (
                        <>
                          <div>
                            <label
                              htmlFor="bedrooms"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Bedrooms
                            </label>
                            <Field
                              type="number"
                              name="bedrooms"
                              id="bedrooms"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <ErrorMessage
                              name="bedrooms"
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="bathrooms"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Bathrooms
                            </label>
                            <Field
                              type="number"
                              name="bathrooms"
                              id="bathrooms"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <ErrorMessage
                              name="bathrooms"
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                        </>
                      )}
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Location
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="location.address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <Field
                        type="text"
                        name="location.address"
                        id="location.address"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="location.address"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location.city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <Field
                        type="text"
                        name="location.city"
                        id="location.city"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="location.city"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location.state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <Field
                        type="text"
                        name="location.state"
                        id="location.state"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="location.state"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="location.pincode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Pincode
                      </label>
                      <Field
                        type="text"
                        name="location.pincode"
                        id="location.pincode"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <ErrorMessage
                        name="location.pincode"
                        component="p"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Amenities
                  </h2>

                  <FieldArray name="amenities">
                    {({ push, remove }) => (
                      <div>
                        {values.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <Field
                              name={`amenities.${index}`}
                              type="text"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="ml-2 p-2 text-red-600 hover:text-red-800"
                            >
                              <FaMinus />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="mt-2 flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <FaPlus className="mr-2" />
                          Add Amenity
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Images */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Images
                  </h2>

                  <Dropzone onDrop={handleDrop} accept="image/*" multiple>
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-500 cursor-pointer"
                      >
                        <input {...getInputProps()} />
                        <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drag & drop images here, or click to select files
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          (Max 10 images, each up to 5MB)
                        </p>
                      </div>
                    )}
                  </Dropzone>

                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden">
                            <img
                              src={
                                typeof image === "string"
                                  ? image
                                  : URL.createObjectURL(image)
                              }
                              alt={`Property image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <FaTrash className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Messages */}
                {status && status.message && (
                  <div
                    className={`p-4 rounded-md ${
                      status.error
                        ? "bg-red-50 text-red-800"
                        : "bg-green-50 text-green-800"
                    }`}
                  >
                    {status.error ? (
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {status.error}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {status.message}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {status && status.message
                          ? status.message
                          : uploadProgress > 0
                          ? `Uploading Images (${Math.round(uploadProgress)}%)`
                          : "Saving..."}
                      </div>
                    ) : (
                      `${isEdit ? "Update" : "Post"} Property`
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;
