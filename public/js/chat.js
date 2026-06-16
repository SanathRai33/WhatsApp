const sendBtn = document.getElementById("sendBtn");

const messageInput = document.getElementById("messageInput");

const chatBody = document.getElementById("chatBody");

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

    const div = document.createElement("div");

    div.classList.add("message", "sent");

    div.innerHTML = `
      <div class="bubble">
        ${text}
        <span class="time">
          ${getTime()}
        </span>
      </div>
    `;

    chatBody.appendChild(div);

    chatBody.scrollTop = chatBody.scrollHeight;

    messageInput.value = "";
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
