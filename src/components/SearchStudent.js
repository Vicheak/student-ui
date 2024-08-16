import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import refreshToken from "../auth/RefreshToken";
import baseApi from '../auth/api';
import "../style/ListStudent.css";

export default function SearchStudent() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchAge, setSearchAge] = useState("");
  const [isClickSearch, setIsClickSearch] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setCredentials(savedCredentials);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const getStudents = (credentials, name = "", age = "") => {
    setIsClickSearch(true);
    //build search request
    let baseSearchApi = baseApi + "students/search?";
    let searchApi = "";
    if (!age) {
      searchApi = `${baseSearchApi}studentName=${name}&_direction=asc`;
    } else {
      searchApi = `${baseSearchApi}studentName=${name}&studentAge=${age}&_direction=asc`;
    }
    axios
      .get(searchApi, {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      })
      .then((response) => {
        setStudents(response.data.payload);
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

  const handleSearch = () => {
    getStudents(credentials, searchName, searchAge);
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
        getStudents(credentials, searchName, searchAge);
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

  return (
    <div className="list mt-3">
      <div>
        <p className="h2 m-0 mx-3">Search Students</p>
      </div>
      <Form className="mx-3 my-4">
        <Row>
          <Col md={5} className="mt-3">
            <Form.Group controlId="formStudentName">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter student name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={5} className="mt-3">
            <Form.Group controlId="formStudentAge">
              <Form.Label>Student Age</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter student age"
                value={searchAge}
                onChange={(e) => setSearchAge(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end mt-3">
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>

      {students.length === 0 ? (
        isClickSearch ? (
          <h2 className="heading mt-4">Students Not Found</h2>
        ) : (
          <h2 className="heading mt-4">Please fill in and click search</h2>
        )
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
                  <td>{i + 1}</td>
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
