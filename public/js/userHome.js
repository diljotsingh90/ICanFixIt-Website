const issueListEl = document.querySelector(".issue-list");
const issueMessagesEl = document.querySelector(".issue-messages");
const toggleButton = document.querySelector(".toggle-chat");
const issueIdInputs = document.querySelectorAll(".issueId");
const messageform = document.querySelector(".chat-field");
const messageInput = document.getElementById("message-text-input");
const userType = document.getElementById("user-type");
const formSubmitButton = document.getElementById("submit-message-btn");
const chatArea = document.querySelector(".chat");
let issueId;

// toggle mode from chat to issues and back
const changeScreens = () => {
  toggleButton.classList.toggle("active");
  if (issueListEl.classList.contains("show")) {
    issueListEl.classList.remove("show");
    issueListEl.classList.add("hide");
    issueMessagesEl.classList.add("show");
    issueMessagesEl.classList.remove("hide");
  } else {
    issueListEl.classList.add("show");
    issueListEl.classList.remove("hide");
    issueMessagesEl.classList.remove("show");
    issueMessagesEl.classList.add("hide");
  }
};

// add chat elements to chat screen
const injectChat = (userId, chat) => {
 
  chatArea.innerHTML = "";
  chat.forEach((message) => {
    const elementOuter = document.createElement("div");
    elementOuter.classList.add("message-bubble");
    if (userId.toString() === message.sender_id.toString()) {
      elementOuter.classList.add("mine");
    }
    const senderName = document.createElement("small");
    senderName.classList.add("sender");

    senderName.innerHTML = message.sender;
    if (userId.toString() === message.sender_id.toString()) {
      senderName.innerHTML = "You";
    }
    const messageElement = document.createElement("p");
    
    messageElement.classList.add("actual-message");
    messageElement.innerHTML = message.content;

    elementOuter.appendChild(senderName);
    if (userId.toString() === message.sender_id.toString()) {
     
    const deleteButton = document.createElement("i");
    deleteButton.setAttribute("class","fa fa-trash fa-1x delete-btn");
    const messageId = message._id.toString();
     deleteButton.setAttribute("onclick",`deleteMessage("${messageId}",this)`); 
     elementOuter.appendChild(deleteButton);
    }

    
    elementOuter.appendChild(messageElement);
    
    chatArea.appendChild(elementOuter);
    updateScroll();
  });
};

//fetching chat according to the issueId
const getChat = async (userId, userType, id) => {
  issueId = id;
  try {
    let result = await fetch("/" + userType + "/messages/" + id, {
      headers: {
        "Content-Type": "application/JSON",
      },
    });
    result = await result.json();
    changeScreens();
    injectChat(userId, result);
  } catch (e) {
    console.log(e);
  }
};

// we see the latest message
function updateScroll() {
  var element = document.querySelector(".chat");
  element.scrollTop = element.scrollHeight;
}

// sending a message and update on dom also
const sendMessage = async (e) => {
  e.preventDefault();
  if (messageInput.value === "" || !issueId) {
    return;
  }

  try {
    const usertyp = userType.value;
    let result = await fetch(`/${usertyp}/createmessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: JSON.stringify({
        message: messageInput.value,
        issueId: issueId,
      }),
    });
     result  = await result.json();
    const deleteButton = document.createElement("i");
    deleteButton.setAttribute("class","fa fa-trash fa-1x delete-btn");
      const messageId = result.data._id.toString(); 
      console.log(messageId);
     deleteButton.setAttribute("onclick",`deleteMessage("${messageId}",this)`); 
  const elementOuter = document.createElement("div");
  elementOuter.classList.add("message-bubble");
  elementOuter.classList.add("mine");
  const senderName = document.createElement("small");
  senderName.classList.add("sender");
  senderName.innerHTML = "You";
  elementOuter.appendChild(deleteButton);
  const messageElement = document.createElement("p");
  messageElement.classList.add("actual-message");
  messageElement.innerHTML = messageInput.value;
  elementOuter.appendChild(senderName);
  elementOuter.appendChild(messageElement);
  chatArea.appendChild(elementOuter);
  messageInput.value = "";
  updateScroll();
} catch (err) {
  console.log(err);
  return;
}
};

//raise the issue again if user is a host
const raiseAgain = async () => {
  if (!issueId) {
    return;
  }
  try {
    let result = await fetch("/host/raiseAgain", {
      headers: {
        "Content-Type": "application/JSON",
      },
      method: "POST",
      body: JSON.stringify({
        issueId: issueId,
      }),
    });
    result = await result.json();
    location.reload();
  } catch (e) {
    console.log(e);
  }
};

const deleteMessage=async (id,el)=>{
  try{
    const usertyp = userType.value;
    let result = await 
    fetch(`/${usertyp}/deletemessage`, {
      headers: {
        "Content-Type": "application/JSON",
      },
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    });
    result = await result.json();
    el.parentElement.remove();
}
catch(err){
  console.log(err);
}
}

toggleButton.addEventListener("click", changeScreens);
formSubmitButton.addEventListener("click", sendMessage);

const deleteIssue=async (id)=>{
  if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    try{
    const result  = await fetch("/user/deleteissue",{
      headers: {
        "Content-Type": "application/JSON",
      },
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    });
    location.reload();
  }
  catch(err){
    console.log(err);
  }
}