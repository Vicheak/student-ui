import React from "react";
import Alert from "react-bootstrap/Alert";

export default function AlertMessage({ variant, title, message, onClose }) {
  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      <Alert.Heading>{title}</Alert.Heading>
      <p>{message}</p>
    </Alert>
  );
}
