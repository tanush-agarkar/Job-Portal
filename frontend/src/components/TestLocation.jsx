import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { LOCATION_API_END_POINT } from "@/utils/constant";

const TestLocation = () => {
  const [examLocation, setExamLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the logged-in user's registration number from the Redux store
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchExamLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch exam location data from the backend using the user's registration number
        const res = await axios.get(
          `${LOCATION_API_END_POINT}/location?studentId=${user.registrationNo}`
        );

        if (res.data.success) {
          setExamLocation(res.data.examLocation);
        } else {
          setError("No exam location found for this student.");
        }
      } catch (err) {
        console.error("Error fetching exam location:", err);
        setError("Failed to fetch exam location.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.registrationNo) {
      fetchExamLocation();
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">Exam Locations</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : examLocation ? (
          <div className="border border-gray-200 rounded-md p-4">
            <h2 className="font-bold text-lg">Exam Location Details</h2>
            <p>
              <strong>Student Name:</strong> {examLocation.studentName}
            </p>
            <p>
              <strong>Branch:</strong> {examLocation.branch}
            </p>
            <p>
              <strong>Student ID:</strong> {examLocation.studentId}
            </p>
            <p>
              <strong>Location:</strong> {examLocation.location}
            </p>
          </div>
        ) : (
          <p>No exam location data available.</p>
        )}
      </div>
    </div>
  );
};

export default TestLocation;
