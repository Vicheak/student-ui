import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertMessage from "./AlertMessage";
import Loading from "./Loading";
import refreshToken from "../auth/RefreshToken";
import baseApi from '../auth/api';
import "../style/CreateNewStudent.css";

export default function CreateNewStudent() {
  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [messageVariant, setMessageVariant] = useState("success");
  const [messageTitle, setMessageTitle] = useState("Alert title");
  const [messageDetail, setMessageDetail] = useState("Alert message");
  const [credentials, setCredentials] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setCredentials(savedCredentials);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleOnClose = () => {
    setShowMessage(false);
  };

  const postData = (e) => {
    e.preventDefault();
    setShowLoading(true);

    axios
      .post(
        `${baseApi}students`,
        {
          studentName,
          studentAge,
        },
        {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        }
      )
      .then((response) => {
        setShowLoading(false);

        // Handle the response here
        console.log("Response Data :", response.data);
        console.log("Status Code :", response.status);

        if (response.status === 201) {
          console.log("Student created successfully");

          setMessageVariant("success");
          setMessageTitle(response.data.message);
          setMessageDetail("");
          setShowMessage(true);
        } else {
          console.log("Unexpected status code:", response.status);
        }

        setStudentName("");
        setStudentAge("");
      })
      .catch((error) => {
        setShowLoading(false);

        // Handle errors here
        if (error.response) {
          // Server responded with a status other than 2xx
          console.log("Error Data :", error.response.data);
          console.log("Error Status Code :", error.response.status);

          if (error.response.status === 400) {
            console.log("Bad Request - Validation Error");
            setMessageVariant("danger");
            setMessageTitle(error.response.data.message);
            setMessageDetail(error.response.data.payload[0].message);
            setShowMessage(true);
          } else if (error.response.status === 401) {
            refreshToken(credentials.username);
          } else if (error.response.status === 500) {
            console.log("Server Error - Try again later");
          } else {
            console.log("Unexpected Error:", error.response.status);
          }
        } else if (error.request) {
          // Request was made but no response was received
          console.log("No response received:", error.request);
        } else {
          // Something else happened while setting up the request
          console.log("Error:", error.message);
        }
      });
  };

  return (
    <div>
      <div className="create-form">
        <div className="create-form">
          <div className="heading">
            <h2>Create New Student</h2>
          </div>
          {showMessage && (
            <div className="my-4">
              <AlertMessage
                variant={messageVariant}
                title={messageTitle}
                message={messageDetail}
                onClose={handleOnClose}
              />
            </div>
          )}
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Student Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="suonvicheak"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="age" className="form-label">
                Student Age
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="21"
                value={studentAge}
                onChange={(e) => setStudentAge(e.target.value)}
              />
            </div>
            <button className="btn btn-success" onClick={postData}>
              Save New Student
            </button>
            {showLoading && (
              <div className="loading mt-2">
                <Loading />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
