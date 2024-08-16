import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Chat.css";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const messagesRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setCurrentUser(savedCredentials.username);
    } else {
      navigate("/login");
    }
  }, []);

  const connect = () => {
    const websocket = new WebSocket("ws://openapi.cheakautomate.online/api/v1/chat");
    setWs(websocket);

    // This function will be called every time a new message arrives
    websocket.onmessage = function (e) {
      console.log(e);
      printMessage(e.data);
    };

    document.getElementById("connectButton").disabled = true;
    document.getElementById("connectButton").value = "Connected";
  };

  const printMessage = (data) => {
    if (messagesRef.current) {
      let messageData = JSON.parse(data);
      let newMessage = document.createElement("div");
      newMessage.className = "incoming-message";
      newMessage.innerHTML = messageData.name + " : " + messageData.message;
      messagesRef.current.appendChild(newMessage);
    }
  };

  const sendToGroupChat = () => {
    if (!ws) return;
    let messageText = document.getElementById("message").value;
    document.getElementById("message").value = "";

    let messageObject = {
      name: currentUser,
      message: messageText,
    };

    let newMessage = document.createElement("div");
    newMessage.innerHTML = messageText + " : " + currentUser;
    newMessage.className = "outgoing-message";

    if (messagesRef.current) {
      messagesRef.current.appendChild(newMessage);
    }

    // Use WebSocket's send method with the message object
    ws.send(JSON.stringify(messageObject));
  };

  return (
    <div className="chat container mt-5">
      <div className="row">
        <div className="col">
          <input
            id="connectButton"
            type="button"
            value="Start Chat"
            className="btn btn-blue mb-2"
            onClick={connect}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <input
            type="text"
            id="message"
            className="form-control mb-2"
            placeholder="Type a message"
          />
          <input
            type="button"
            value="Send"
            className="btn btn-color mb-2"
            onClick={sendToGroupChat}
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div id="messages" ref={messagesRef} className="border p-3"></div>
        </div>
      </div>
    </div>
  );
}
