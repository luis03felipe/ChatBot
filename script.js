const chatInput = document.querySelector(".chat-input textarea")
const sendChatBtn = document.querySelector(".chat-input span")
const chatbox = document.querySelector(".chatbox")
const chatbotToggler = document.querySelector(".chatbot-toggler")
const chatbotCloseBtn = document.querySelector(".close-btn")

let userMessage
const API_KEY = "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"

const createChatLi = (message, className) => {
  // Cria um elemento chat <li> com mensagem passada e className
  const chatLi = document.createElement("li")
  chatLi.classList.add("chat", className)
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
  chatLi.innerHTML = chatContent
  chatLi.querySelector("p").textContent = message
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
      messageElement.classList.add("error")
      messageElement.textContent =
        "Opa, algo deu errado. Por favor, tente novamente!"
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
}

const handleChat = () => {
  userMessage = chatInput.value.trim() //recebendo a mensagem inserida e removendo espaços em branco extras
  if (!userMessage) return
  chatInput.value = ""

  //Adiciona a mensagem do usuário na chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"))
  chatbox.scrollTo(0, chatbox.scrollHeight)

  //Adiciona o "Digitando..."
  setTimeout(() => {
    const incomingChatLi = createChatLi("Digitando...", "incoming")
    chatbox.appendChild(incomingChatLi)
    chatbox.scrollTo(0, chatbox.scrollHeight)
    generateResponse(incomingChatLi)
  }, 600)
}

sendChatBtn.addEventListener("click", handleChat)
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
)
chatbotCloseBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
)
