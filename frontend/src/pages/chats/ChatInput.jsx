'use client';

import React, { useState, memo, useCallback } from 'react';
import styles from './index.module.css';

function ChatInput({ onSendMessage }) {
   const [text, setText] = useState("");

   const handleSend = useCallback(() => {
      if (!text.trim()) return;
      onSendMessage(text);
      setText("");
   }, [text, onSendMessage]);

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
         handleSend();
      }
   };

   return (
      <div className={styles.inputArea}>
         <input
            type="text"
            placeholder="Type your message here..."
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={handleKeyPress} 
         />
         <button type="button" onClick={handleSend}>Send</button>
      </div>
   );
}

export default memo(ChatInput);
