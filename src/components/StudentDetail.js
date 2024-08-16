import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import refreshToken from '../auth/RefreshToken';
import baseApi from '../auth/api';
import "../style/ListStudent.css";

export default function StudentDetail() {
  const [student, setStudent] = useState({});
  const [credentials, setCredentials] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setCredentials(savedCredentials);
      getStudent(savedCredentials);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getStudent = (credentials) => {
    axios
      .get(`${baseApi}students/${id}`, {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      })
      .then((response) => {
        setStudent(response.data.payload);
      })
      .catch((error) => {
        console.log(error);

        // Handle errors here
        if (error.response) {
          // Server responded with a status other than 2xx
          console.log("Error Data :", error.response.data);
          console.log("Error Status Code :", error.response.status);

          if (error.response.status === 401) {
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

  if (!student.studentName) {
    return <h2 className="heading mt-4">404 Student Not Found</h2>;
  } else {
    return (
      <div className="list mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <p className="h2 m-0 mx-3">Student Detail</p>
          <Link to={`/view`} className="btn btn-primary mx-3">
            Back
          </Link>
        </div>
        <div className="mx-2">
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{student.studentName}</td>
                <td>{student.studentAge}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
