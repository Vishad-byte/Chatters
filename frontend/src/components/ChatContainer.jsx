import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { X } from 'lucide-react';

const ChatContainer = () => {
    const {messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages, unsubscribeFromMessages} = useChatStore();

    const {authUser} = useAuthStore();
    const messageEndRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect( () => {
        getMessages(selectedUser._id);

        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if(isMessagesLoading) {  return (
        <div className=' flex-1 flex flex-col overflow-auto'>
            <ChatHeader/>
            <MessageSkeleton/>
            <MessageInput/>
        </div>
    )}

  return (
    <div className=' flex-1 flex flex-col overflow-auto relative'>
        <ChatHeader/>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col ${message.image && !message.text ? "bg-transparent p-0" : ""}`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  onClick={() => setSelectedImage(message.image)}
                  className="w-[280px] sm:w-[450px] max-h-[350px] object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Full screen preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button 
              className="absolute -top-3 -right-3 btn btn-circle btn-sm bg-base-300 text-white hover:bg-base-100 border-none"
              onClick={() => setSelectedImage(null)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

        <MessageInput/>
    </div>
  )
}

export default ChatContainer
