const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatBody = document.getElementById("chatBody");
const currentUserId = Number(localStorage.getItem("userId"));
const token = localStorage.getItem("token");
const joinBtn = document.getElementById("joinBtn");
const receiverEmail = document.getElementById("receiverEmail");

let currentRoom = "";

const socket = io({
  auth: { token },
});

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sendMessage() {
  const text = messageInput.value.trim();

  if (!text) return;

  if (!currentRoom) {
    alert("Join a room first");

    return;
  }

  socket.emit("new_message", {
    roomId: currentRoom,
    message: text,
  });

  messageInput.value = "";
}

function renderMessage(msg) {
  const div = document.createElement("div");

  div.classList.add("message");

  if (Number(msg.userId) === currentUserId) {
    div.classList.add("sent");
  } else {
    div.classList.add("received");
  }

  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  div.innerHTML = `
    <div class="bubble">
    <small>${msg.username}</small>
    <p>${msg.message}</p>
      <span class="time">
        ${time}
      </span>
    </div>
  `;

  chatBody.appendChild(div);
}

async function loadMessages() {
  try {
    const { data } = await axios.get("/api/messages");

    chatBody.innerHTML = "";

    data.messages.forEach(renderMessage);

    chatBody.scrollTop = chatBody.scrollHeight;
  } catch (error) {
    console.log(error);
  }
}

function createRoomId(email1, email2) {
  return [email1, email2].sort().join("_");
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadMessages();
});

socket.on("new-message", (msg) => {
  renderMessage(msg);

  chatBody.scrollTop = chatBody.scrollHeight;
});

socket.on("receive_message", (msg) => {
  renderMessage({
    message: msg.message,
    userId: msg.senderId,
    username: msg.senderName,
    createdAt: msg.createdAt,
  });
});

joinBtn.addEventListener("click", () => {
  const myEmail = localStorage.getItem("email");

  const otherEmail = receiverEmail.value.trim();

  if (!otherEmail) return;

  currentRoom = createRoomId(myEmail, otherEmail);

  socket.emit("join_room", currentRoom);

  console.log("Joined Room:", currentRoom);
});
