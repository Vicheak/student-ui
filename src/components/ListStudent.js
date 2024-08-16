import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import refreshToken from "../auth/RefreshToken";
import baseApi from '../auth/api';
import "../style/ListStudent.css";


export default function ListStudent() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  const navigate = useNavigate();
  const limit = 5;

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setCredentials(savedCredentials);
      getStudents(savedCredentials, currentPage);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getStudents = (credentials, page) => {
    axios
      .get(
        `${baseApi}students/paginate?_page=${page}&_limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        }
      )
      .then((response) => {
        let payload = response.data.payload;
        setStudents(payload.content);
        setCurrentPage(payload.pagination.pageNumber);
        setTotalPages(payload.pagination.totalPage);
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

  const handleDelete = (id) => {
    axios
      .delete(`${baseApi}students/${id}`, {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      })
      .then((response) => {
        console.log(`Student with id ${id} deleted successfully`);
        setShowModal(false); // Close the modal
        getStudents(credentials, 1);
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

  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getStudents(credentials, newPage);
  };

  return (
    <div className="list mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <p className="h2 m-0 mx-3">List Students</p>
        <Link to={`/create`} className="btn btn-primary mx-3">
          Create New
        </Link>
      </div>
      {students.length === 0 ? (
        <h2 className="heading mt-4">There are no students</h2>
      ) : (
        <div className="table-responsive-sm">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>N#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={i + 1}>
                  <td>{(currentPage - 1) * limit + i + 1}</td>
                  <td>{student.studentName}</td>
                  <td>{student.studentAge}</td>
                  <td>
                    <Link
                      to={`/detail/${student.studentId}`}
                      className="btn btn-success mx-2 btn-small"
                    >
                      Detail
                    </Link>
                    <Link
                      to={`/update/${student.studentId}`}
                      className="btn btn-warning mx-2 btn-small"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger mx-2 btn-small"
                      onClick={() => openModal(student)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-controls d-flex justify-content-center mt-4">
            <Button
              variant="primary"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="primary"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {selectedStudent && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
          </Modal.Header>
          <Modal.Body>Delete student {selectedStudent.studentName}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleDelete(selectedStudent.studentId)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
