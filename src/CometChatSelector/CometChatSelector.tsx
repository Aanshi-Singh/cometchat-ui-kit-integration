import { useEffect, useState } from "react";
import { Call, Conversation, Group, User, CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatCallLogs, CometChatConversations, CometChatGroups, CometChatUIKitLoginListener, CometChatUsers } from "@cometchat/chat-uikit-react";
import { CometChatTabs } from "../CometChatTabs/CometChatTabs";
import "./CometChatSelector.css";

interface SelectorProps {
    onSelectorItemClicked?: (input: User | Group | Conversation | Call, type: string) => void;
    onHide?: () => void;
    onNewChatClicked?: () => void;
}

export const CometChatSelector = (props: SelectorProps) => {
    const {
        onSelectorItemClicked = () => { },
    } = props;

    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>();
    const [activeItem, setActiveItem] = useState<CometChat.Conversation | CometChat.User | CometChat.Group | CometChat.Call | undefined>();
    const [activeTab, setActiveTab] = useState<string>("chats");

    useEffect(() => {
        const loggedInUsers = CometChatUIKitLoginListener.getLoggedInUser();
        setLoggedInUser(loggedInUsers)
    }, [])

    return (
        <>
            {loggedInUser && <>
                {activeTab == "chats" ? (
                    <CometChatConversations
                        activeConversation={activeItem instanceof CometChat.Conversation ? activeItem : undefined}
                        onItemClick={(e) => {
                            setActiveItem(e);
                            onSelectorItemClicked(e, "updateSelectedItem");
                        }}
                    />
                ) : activeTab == "calls" ? (
                    <CometChatCallLogs
                        activeCall={activeItem instanceof CometChat.Call ? activeItem : undefined}
                        onItemClick={(e: Call) => {
                            setActiveItem(e);
                            onSelectorItemClicked(e, "updateSelectedItemCall");
                        }}
                    />
                ) : activeTab == "users" ? (
                    <CometChatUsers
                        activeUser={activeItem instanceof CometChat.User ? activeItem : undefined}
                        onItemClick={(e) => {
                            setActiveItem(e);
                            onSelectorItemClicked(e, "updateSelectedItemUser");
                        }}
                    />
                ) : activeTab == "groups" ? (
                    <CometChatGroups
                        activeGroup={activeItem instanceof CometChat.Group ? activeItem : undefined}
                        onItemClick={(e) => {
                            setActiveItem(e);
                            onSelectorItemClicked(e, "updateSelectedItemGroup");
                        }}
                    />
                ) : null}
            </>}
            <CometChatTabs activeTab={activeTab} onTabClicked={(item: { name: string; icon?: string; }) => {
                setActiveTab(item.name.toLowerCase())
            }} />
        </>
    );
}