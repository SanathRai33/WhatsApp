const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatBody = document.getElementById("chatBody");
const currentUserId = Number(localStorage.getItem("userId"));
const token = localStorage.getItem("token");
const joinBtn = document.getElementById("joinBtn");
const receiverEmail = document.getElementById("receiverEmail");
const mediaInput = document.getElementById("mediaInput");
const suggestionBox = document.getElementById("suggestions");

let currentRoom = "";
let timeout;

const socket = io({
  auth: { token },
});

// Functions
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
  const emptyState = document.querySelector(".empty-state");

  if (emptyState) {
    emptyState.remove();
  }

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

function createRoomId(email1, email2) {
  return [email1, email2].sort().join("_");
}

function renderMedia(media) {
  const div = document.createElement("div");

  if (media.messageType === "image") {
    div.innerHTML = `
      <img
        src="${media.fileUrl}"
        width="250"
      />
    `;
  } else if (media.messageType === "video") {
    div.innerHTML = `
      <video controls width="250">
        <source src="${media.fileUrl}">
      </video>
    `;
  } else {
    div.innerHTML = `
      <a
        href="${media.fileUrl}"
        target="_blank"
      >
        Download File
      </a>
    `;
  }

  chatBody.appendChild(div);
}

function renderSuggestions(suggestions) {
  suggestionBox.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const chip = document.createElement("button");

    chip.className = "suggestion-chip";

    chip.textContent = suggestion;

    chip.onclick = () => {
      messageInput.value = suggestion;
    };

    suggestionBox.appendChild(chip);
  });
}

function renderReplies(replies) {
  const container = document.getElementById("smartReplies");

  container.innerHTML = "";

  replies.forEach((reply) => {
    const button = document.createElement("button");

    button.className = "reply-chip";

    button.textContent = reply;

    button.onclick = () => {
      messageInput.value = reply;
    };

    container.appendChild(button);
  });
}

// Async Function
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

async function uploadMedia() {
  const file = mediaInput.files[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("media", file);

  formData.append("userId", currentUserId);

  formData.append("groupId", currentGroupId);

  await axios.post("/api/media/upload", formData);
}

async function fetchSuggestions() {
  const text = messageInput.value;

  if (text.length < 3) {
    return;
  }

  const { data } = await axios.post("/api/ai/suggest", {
    text,
  });

  renderSuggestions(data.suggestions);
}

async function loadSmartReplies(message) {
  const { data } = await axios.post("/api/ai/replies", {
    message,
  });

  renderReplies(data.replies);
}

// Event Listeners
sendBtn.addEventListener("click", sendMessage);

mediaInput.addEventListener("change", uploadMedia);

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadMessages();
});

joinBtn.addEventListener("click", async () => {
  const targetEmail = receiverEmail.value.trim();

  if (!targetEmail) {
    alert("Enter email");
    return;
  }

  try {
    const { data } = await axios.get(
      `/api/auth/check-user?email=${targetEmail}`,
    );

    if (!data.success) {
      return;
    }

    const myEmail = localStorage.getItem("email");

    currentRoom = createRoomId(myEmail, targetEmail);

    socket.emit("join_room", currentRoom);

    alert(`Joined room ${currentRoom}`);
  } catch (error) {
    alert("User does not exist");
  }
});

messageInput.addEventListener("input", () => {
  clearTimeout(timeout);

  timeout = setTimeout(fetchSuggestions, 600);
});

// Socket methods
socket.on("new-message", (msg) => {
  renderMessage(msg);

  chatBody.scrollTop = chatBody.scrollHeight;
});

socket.on("receive_message", (msg) => {
  console.log("Received Message:", msg);

  renderMessage({
    message: msg.message,
    userId: msg.senderId,
    username: msg.senderName,
    createdAt: msg.createdAt,
  });
});

socket.on("new-media", (data) => {
  const div = document.createElement("div");

  div.innerHTML = `
      <img
        src="${data.mediaUrl}"
        width="200"
      />
    `;

  chatBody.appendChild(div);
});

socket.on("receive_group_media", (data) => {
  renderMedia(data);
});

socket.on("receive_message", async (msg) => {
  renderMessage(msg);

  await loadSmartReplies(msg.message);
});
