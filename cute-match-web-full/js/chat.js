// Chat functionality
const box = document.getElementById('chatBox');
let currentChat = '';

const conversations = {
  sarah: {
    name: '👸 Sarah',
    messages: [
      { sent: false, text: 'Hi! How was your day? 😊' },
      { sent: true, text: 'Great! How about you?' },
      { sent: false, text: 'Amazing! Want to meet tomorrow?' },
      { sent: true, text: 'Sure! What time?' },
      { sent: false, text: 'How about 7 PM at the coffee shop?' },
      { sent: true, text: 'Perfect! Looking forward to it! 😄' }
    ]
  },
  emma: {
    name: '💃 Emma',
    messages: [
      { sent: false, text: 'Hey there! 👋' },
      { sent: true, text: 'Hi Emma! How are you?' },
      { sent: false, text: 'Good! Sounds good! When?' }
    ]
  },
  lisa: {
    name: '👯 Lisa',
    messages: [
      { sent: false, text: 'I love that! 🎵' },
      { sent: true, text: 'Me too! We should go to a concert together' },
      { sent: false, text: 'OMG yes! That would be so fun!' }
    ]
  },
  jessica: {
    name: '👱‍♀️ Jessica',
    messages: [
      { sent: false, text: 'Thanks for the recommendation! ❤️' },
      { sent: true, text: 'You\'re welcome! How did you like it?' }
    ]
  }
};

function selectChat(chatKey) {
  currentChat = chatKey;
  const chat = conversations[chatKey];
  
  // Update header
  document.getElementById('chatHeader').innerHTML = `<h2 style="margin: 0; font-size: 20px;">${chat.name}</h2>`;
  
  // Clear and load messages
  box.innerHTML = '';
  chat.messages.forEach(msg => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (msg.sent ? 'sent' : 'received');
    messageDiv.textContent = msg.text;
    box.appendChild(messageDiv);
  });
  
  // Scroll to bottom
  box.scrollTop = box.scrollHeight;
  
  // Highlight selected conversation
  document.querySelectorAll('.conversation-item').forEach(item => {
    item.style.background = 'transparent';
    item.style.borderColor = 'transparent';
  });
  event.currentTarget.style.background = 'var(--light-pink)';
  event.currentTarget.style.borderColor = 'var(--primary)';
}

function send() {
  if (!currentChat) {
    alert('Please select a conversation first!');
    return;
  }
  
  let m = document.getElementById('msg');
  if (!m.value.trim()) return;
  
  // Add message to current conversation
  const chat = conversations[currentChat];
  chat.messages.push({ sent: true, text: m.value });
  
  // Add to display
  let d = document.createElement('div');
  d.className = 'message sent';
  d.textContent = m.value;
  box.appendChild(d);
  
  m.value = '';
  box.scrollTop = box.scrollHeight;
  
  // Simulate response after 1 second
  setTimeout(() => {
    const responses = [
      'That\'s awesome! 😊',
      'I totally agree! 💕',
      'Haha, so true! 😄',
      'Can\'t wait! 🎉',
      'You\'re amazing! 💖',
      'Exactly what I was thinking! ❤️'
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    chat.messages.push({ sent: false, text: response });
    
    let d = document.createElement('div');
    d.className = 'message received';
    d.textContent = response;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  }, 1000);
}

// Allow sending with Enter key
document.addEventListener('DOMContentLoaded', () => {
  const msgInput = document.getElementById('msg');
  if (msgInput) {
    msgInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') send();
    });
  }
});
