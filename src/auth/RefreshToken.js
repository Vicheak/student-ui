import axios from "axios";

export default function refreshToken(username) {
  // Perform the login request
  const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
  let refreshToken = savedCredentials.refreshToken;
  axios
    .post(`http://localhost:8080/api/v1/auth/refreshToken`, {
      refreshToken,
    })
    .then((response) => {
      // If login is successful, save the credentials
      let accessToken = response.data.accessToken;
      let refreshToken = response.data.refreshToken;

      const credentials = {
        username,
        accessToken,
        refreshToken,

      };

      localStorage.setItem("credentials", JSON.stringify(credentials));

      console.log("Refresh successfully!");
    })
    .catch((error) => {
      console.log("Invalid refresh token");
    });
}
