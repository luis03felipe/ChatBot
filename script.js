const chatInput = document.querySelector(".chat-input textarea")
const sendChatBtn = document.querySelector(".chat-input span")
const chatbox = document.querySelector(".chatbox")

let userMessage
const API_KEY = "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"

const createChatLi = (message, className) => {
  // Cria um elemento chat <li> com mensagem passada e className
  const chatLi = document.createElement("li")
  chatLi.classList.add("chat", className)
  let chatContent =
    className === "outgoing"
      ? `<p>${message}</p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`
  chatLi.innerHTML = chatContent
  return chatLi
}

//Essa API é da empresa que criou o chatgpt
const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions"
  const messageElement = incomingChatLi.querySelector("p")

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  }

  // Envia solicitação POST para a API, obter resposta
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content
    })
    .catch((error) => {
      messageElement.textContent =
        "Opa, algo deu errado. Por favor, tente novamente!"
    })
}

const handleChat = () => {
  userMessage = chatInput.value.trim() //recebendo a mensagem inserida e removendo espaços em branco extras
  if (!userMessage) return

  //Adiciona a mensagem do usuário na chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"))
  const incomingChatLi = createChatLi("Digitando...", "incoming")

  //Adiciona o "Digitando..."
  setTimeout(() => {
    chatbox.appendChild(incomingChatLi)
    generateResponse(incomingChatLi)
  }, 600)
}

sendChatBtn.addEventListener("click", handleChat)
