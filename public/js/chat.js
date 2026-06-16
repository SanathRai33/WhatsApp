const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatBody = document.getElementById("chatBody");

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addMessage(message) {
  const wrapper = document.createElement("div");

  wrapper.classList.add("message", "sent");

  wrapper.innerHTML = `
    <div class="bubble">
      ${message}
      <span class="time">${getTime()}</span>
    </div>
  `;

  chatBody.appendChild(wrapper);

  chatBody.scrollTop = chatBody.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();

  if (!text) return;

  addMessage(text);

  messageInput.value = "";
});

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

window.onload = () => {
  chatBody.scrollTop = chatBody.scrollHeight;
};
