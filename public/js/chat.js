const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatBody = document.getElementById("chatBody");
const currentUserId = Number(localStorage.getItem("userId"));
const socket = io();

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function sendMessage() {
  const text = messageInput.value.trim();

  if (!text) return;

  const userId = localStorage.getItem("userId");

  try {
    await axios.post("/api/messages/send", {
      userId,
      message: text,
    });

    messageInput.value = "";
  } catch (error) {
    console.log(error);
  }
}

function renderMessage(msg) {
  const div = document.createElement("div");

  div.classList.add("message");

  if (msg.userId === currentUserId) {
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
      ${msg.message}
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
