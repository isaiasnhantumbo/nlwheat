import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { io } from 'socket.io-client';
import { MESSAGES_EXAMPLE } from '../../../utils/messages';
import { api } from '../../services/api';
import { Message, MessageProps } from '../Message';

import { styles } from './styles';

let messageQueue: MessageProps[] = [];

const socket = io(String(api.defaults.baseURL));

socket.on('new_message', (newMessage) => {
  messageQueue.push(newMessage);
});

export function MessageList() {
  const [currentMessage, setCurrentMessage] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const messagesResponse = await api.get<MessageProps[]>('/messages/last3');
      setCurrentMessage(messagesResponse.data);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setCurrentMessage((prevState) => [
          messageQueue[0],
          prevState[0],
          prevState[1],
        ]);
        messageQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessage.map((message) => (
        <Message key={message.id} data={message} />
      ))}
    </ScrollView>
  );
}
