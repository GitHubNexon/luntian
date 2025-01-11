import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/config";

const useBase = () => {
  const [userTypes, setUserTypes] = useState([]); // Only managing userTypes
  const [genders, setGenders] = useState([]); // Change to genders for consistency
  const [csh, setCsh] = useState([]);
  const [collegeCourses, setCollegeCourses] = useState([]);
  const [seniorHighStrands, setSeniorHighStrands] = useState([]);
  const [selectedCsh, setSelectedCsh] = useState(""); // Store selected value for csh

    // Dynamically filter based on selectedCsh
    const filteredCollegeCourses = selectedCsh === "College" ? collegeCourses : [];
    const filteredSeniorHighStrands = selectedCsh === "Senior-High" ? seniorHighStrands : [];

  useEffect(() => {
    fetchBase();
  }, []);

  const fetchBase = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/base/`);
      const base = response.data;
      setUserTypes(base.userTypes); // Only setting userTypes from the response
      setGenders(base.genders); 
      setCsh(base.csh);
      setCollegeCourses(base.collegeCourses);
      setSeniorHighStrands(base.seniorHighStrands);
    } catch (error) {
      console.error("Error fetching base data: ", error);
    }
  };

  return {
    userTypes,
    setUserTypes,
    genders,
    csh,
    filteredCollegeCourses, // Filtered courses based on the selectedCsh
    filteredSeniorHighStrands, // Filtered strands based on the selectedCsh
    collegeCourses,
    seniorHighStrands,
    selectedCsh,
    setSelectedCsh, 
    fetchBase, // Returning only userTypes
  };
};

export default useBase;
