import React, { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Show user message in chat
    const newChat = [...chatLog, { role: 'user', content: userInput }];
    setChatLog(newChat);

    try {
      const res = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      setChatLog([...newChat, { role: 'bot', content: data.reply }]);
    } catch (error) {
      setChatLog([...newChat, { role: 'bot', content: 'Error connecting to Jobsy 🤖' }]);
    }

    setUserInput('');
  };

  return (
    <div style={styles.container}>
      <h1>Jobsy 🤖 – AI Career Chatbot</h1>

      <div style={styles.chatBox}>
        {chatLog.map((msg, index) => (
          <div key={index} style={msg.role === 'user' ? styles.user : styles.bot}>
            <strong>{msg.role === 'user' ? 'You' : 'Jobsy'}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask me anything about careers..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' },
  chatBox: {
    background: '#f3f3f3',
    borderRadius: '8px',
    padding: '20px',
    height: '400px',
    overflowY: 'auto',
    marginBottom: '20px',
  },
  user: { textAlign: 'right', marginBottom: '10px' },
  bot: { textAlign: 'left', marginBottom: '10px' },
  inputArea: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '10px', fontSize: '16px' },
  button: { padding: '10px 20px', fontSize: '16px' },
};

export default App;
