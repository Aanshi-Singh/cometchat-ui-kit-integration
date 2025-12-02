import { useState, useEffect } from "react";
import { 
  CometChatMessageComposer, 
  CometChatMessageHeader, 
  CometChatMessageList,
  CometChatIncomingCall,
  CometChatOutgoingCall
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatSelector } from "../CometChatSelector/CometChatSelector";
import "./ChatDemo.css";

export const ChatDemo = () => {
  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>(undefined);
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group | undefined>(undefined);
  const [selectedCall, setSelectedCall] = useState<CometChat.Call | undefined>(undefined);
  const [outgoingCall, setOutgoingCall] = useState<CometChat.Call | undefined>(undefined);

  // Listen for call events to properly handle call state changes
  useEffect(() => {
    const listenerID = "CALL_LISTENER_" + Date.now();
    
    CometChat.addCallListener(
      listenerID,
      new CometChat.CallListener({
        onOutgoingCallAccepted: () => {
          // Call was accepted, clear outgoing call state
          setOutgoingCall(undefined);
        },
        onOutgoingCallRejected: () => {
          // Call was rejected, clear outgoing call state
          setOutgoingCall(undefined);
        },
        onIncomingCallCancelled: () => {
          // Incoming call was cancelled by the caller
        },
        onCallEndedMessageReceived: () => {
          // Call ended, clear any call state
          setOutgoingCall(undefined);
        },
      })
    );

    // Cleanup listener on unmount
    return () => {
      CometChat.removeCallListener(listenerID);
    };
  }, []);

  // Helper function to get user/group from a call log entry
  const handleCallLogClick = (call: CometChat.Call) => {
    const callInitiator = call.getCallInitiator();
    const callReceiver = call.getCallReceiver();
    
    // Determine if the logged-in user initiated the call
    // If so, show the receiver; otherwise, show the initiator
    CometChat.getLoggedinUser().then((loggedInUser) => {
      if (loggedInUser && callInitiator.getUid() === loggedInUser.getUid()) {
        // Current user initiated the call, show the receiver
        if (callReceiver instanceof CometChat.User) {
          setSelectedUser(callReceiver);
          setSelectedGroup(undefined);
        } else if (callReceiver instanceof CometChat.Group) {
          setSelectedUser(undefined);
          setSelectedGroup(callReceiver);
        }
      } else {
        // Current user received the call, show the initiator
        setSelectedUser(callInitiator);
        setSelectedGroup(undefined);
      }
      setSelectedCall(call);
    });
  };

  return (
    <div className="chat-app-container">
      {/* Incoming Call Component - Shows UI when receiving a call */}
      <CometChatIncomingCall 
        onDecline={(call) => {
          // Reject the call to stop the ringtone
          CometChat.rejectCall(call.getSessionId(), CometChat.CALL_STATUS.REJECTED);
          setOutgoingCall(undefined)
        }}
      />
      
      {/* Outgoing Call Component - Shows UI when making a call */}
      {outgoingCall && (
        <CometChatOutgoingCall 
          call={outgoingCall} 
          onCallCanceled={() => setOutgoingCall(undefined)}
        />
      )}

      {/* Back to Landing Button */}
      {/* <button 
        className=""
        onClick={() => navigate("/")}
      >
        <span>←</span>
      </button> */}

      <div className="conversations-with-messages">
        <div className="conversations-wrapper">
          <CometChatSelector onSelectorItemClicked={(activeItem) => {
            let item = activeItem;
            if (activeItem instanceof CometChat.Conversation) {
              item = activeItem.getConversationWith();
            }
            if (item instanceof CometChat.User) {
              setSelectedUser(item as CometChat.User);
              setSelectedCall(undefined);
              setSelectedGroup(undefined);
            } else if (item instanceof CometChat.Group) {
              setSelectedUser(undefined);
              setSelectedGroup(item as CometChat.Group);
              setSelectedCall(undefined);
            }
            else if (item instanceof CometChat.Call) {
              // When clicking a call log, get the other participant
              handleCallLogClick(item as CometChat.Call);
            }
          }} />
        </div>
        {selectedUser || selectedGroup ? (
          <div className="messages-wrapper">
            <CometChatMessageHeader user={selectedUser} group={selectedGroup} />
            <CometChatMessageList user={selectedUser} group={selectedGroup} />
            <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
          </div>
        ) : selectedCall ? (
          <div className="empty-conversation">
            <div className="call-info">
              <span className="call-icon">📞</span>
              <p>Call selected from history</p>
              <p className="call-hint">Click on the user/group in the conversation to chat or use the call buttons in the header to call.</p>
            </div>
          </div>
        ) : (
          <div className="empty-conversation">Select Conversation to start</div>
        )}
      </div>
    </div>
  );
};

