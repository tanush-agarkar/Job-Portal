import React, { useEffect, useRef, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const PostExamLocation = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [examLocations, setExamLocations] = useState([]); // State to store uploaded data
  const fileInputRef = useRef(null);

  // Fetch existing exam locations on page load
  useEffect(() => {
    const fetchExamLocations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/location/all" // Replace with your backend endpoint to fetch all data
        );
        if (res.data.success) {
          setExamLocations(res.data.examLocations); // Update state with fetched data
        }
      } catch (error) {
        console.error("Error fetching exam locations:", error);
        toast.error("Failed to fetch existing exam locations.");
      }
    };

    fetchExamLocations();
  }, []);

  // Handle file selection
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = [".xlsx", ".xls"];
      const fileExtension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        toast.error("Please upload only .xlsx or .xls files");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  // Trigger file input click
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  // Submit the form to upload the file
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please upload a file before submitting");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Post the Excel file to the backend
      const res = await axios.post(
        "http://localhost:8000/api/v1/location/upload", // Replace with your backend endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setSelectedFile(null); // Clear the selected file after successful upload

        // Fetch the updated data from the backend
        const fetchRes = await axios.get(
          "http://localhost:8000/api/v1/location/all" // Replace with your backend endpoint to fetch all data
        );
        if (fetchRes.data.success) {
          setExamLocations(fetchRes.data.examLocations); // Update state with fetched data
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="mt-4">
            <Label
              htmlFor="file-upload"
              className="block mb-2 text-sm font-medium"
            >
              Upload Student Location File (Excel)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleChooseFile}
              >
                Choose File
              </Button>
              {selectedFile && (
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
              )}
            </div>
          </div>

          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Upload File
            </Button>
          )}
        </form>
      </div>

      {/* Display uploaded data */}
      <div className="max-w-7xl mx-auto my-10">
        <h2 className="text-xl font-bold mb-4">Uploaded Exam Locations</h2>
        {examLocations.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  Student Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Branch</th>
                <th className="border border-gray-300 px-4 py-2">Student ID</th>
                <th className="border border-gray-300 px-4 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {examLocations.map((location, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {location.studentName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {location.branch}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {location.studentId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {location.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">
            No data available. Upload a file to see the data.
          </p>
        )}
      </div>
    </div>
  );
};

export default PostExamLocation;
