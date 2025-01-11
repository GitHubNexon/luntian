import { useState } from "react";
import * as ProfileApi from "../api/profileApi"; // Import everything
import { toast } from "react-toastify"; // Import toast
import showDialog from "../utils/showDialog";
import { useLoader } from "../context/useLoader"; // Import the LoaderContext

const initialFormData = {
  username: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  age: "",
  contactNumber: "",
  bio: "",
  aboutMe: "",
  email: "",
  password: "",
  profileImage: "",
  region_id: "",
  province_id: "",
  municipality_id: "",
  barangay_id: "",
  streetAddress: "",
  houseNumber: "",
  zipCode: "",
};

const useProfileContext = (profileId) => {
  const { loading } = useLoader(); // Access the loading function from the LoaderContext
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.region_id ||
      !formData.province_id ||
      !formData.municipality_id ||
      !formData.barangay_id
    ) {
      toast.error("Missing required fields!");
      return;
    }

    try {
      const selectedRegion = await ProfileApi.getRegionById(formData.region_id);
      const selectedProvince = await ProfileApi.getProvinceById(
        formData.province_id
      );
      const selectedMunicipality = await ProfileApi.getMunicipalityById(
        formData.municipality_id
      );
      const selectedBarangay = await ProfileApi.getBarangayById(
        formData.barangay_id
      );

      if (
        !selectedRegion ||
        !selectedProvince ||
        !selectedMunicipality ||
        !selectedBarangay
      ) {
        toast.error("One or more selected entities not found in the database.");
        return;
      }

      const profileData = {
        username: formData.username,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        age: formData.age,
        bio: formData.bio,
        aboutMe: formData.aboutMe,
        contactNumber: formData.contactNumber,
        profileImage: formData.profileImage,
        address: {
          region: {
            id: Number(formData.region_id),
            region_name: selectedRegion.region_name,
          },
          province: {
            id: Number(formData.province_id),
            province_name: selectedProvince.province_name,
          },
          municipality: {
            id: Number(formData.municipality_id),
            municipality_name: selectedMunicipality.municipality_name,
          },
          barangay: {
            id: Number(formData.barangay_id),
            barangay_name: selectedBarangay.barangay_name,
          },
          streetAddress: formData.streetAddress,
          houseNumber: formData.houseNumber,
          zipCode: formData.zipCode,
        },
      };

      console.log(
        "Updating profile data:",
        JSON.stringify(profileData, null, 2)
      );

      // Show confirmation dialog
      const confirmed = await showDialog.confirm("Update this profile?");
      if (!confirmed) return; // Exit if the user cancels

      // Show the loader
      loading(true); // Start loading

      // Update existing profile
      const response = await ProfileApi.updateProfile(profileId, profileData);
      toast.success("Profile updated successfully!");

      // // Reset the form fields after successful update
      // setFormData(initialFormData);

      // Keep the loader visible for 3 seconds
      setTimeout(() => {
        loading(false); // Stop loading
        window.location.reload(); // Refresh the window after 3 seconds
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error); // Log the full error
      if (error.response) {
        toast.error("Error updating profile: " + error.response.data);
      } else if (error.request) {
        toast.error("No response received. Please try again.");
      } else {
        toast.error("Error: " + error.message);
      }
      loading(false); // Ensure loader is stopped on error
    }
  };

  return { formData, handleChange, handleSubmit, setFormData };
};

export default useProfileContext;
