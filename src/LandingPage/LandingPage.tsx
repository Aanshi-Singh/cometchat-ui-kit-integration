import { useState } from "react";
import { useNavigate } from "react-router-dom";
import noAppIdError from "../assets/noAppIdError.png";
import encircledMissingItems from "../assets/encircledmissingitems.png";
import fullPageMissingItems from "../assets/fullPageWithMissingItems.png";
import wrongAudioIcon from "../assets/wrongAdioIcon.png";
import emptyDelivered from "../assets/emptydelivered.png";
import "./LandingPage.css";

interface DXItem {
  id: string;
  title: string;
  description: string;
  example?: string;
  image?: string;
  images?: { src: string; caption: string }[];
  codeBlock?: string;
}

interface Section {
  items: DXItem[];
  emoji: string;
  title: string;
  color: string;
}

export const LandingPage = () => {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const goodDX: DXItem[] = [
    {
      id: "good-1",
      title: "Quick Installation",
      description: `The installation process is straightforward and efficient. A single package installation is all that is required, there is no need to manage multiple dependencies. The UI Kit includes the SDK as a bundled dependency, enabling developers to begin implementation immediately.`,
      codeBlock: ``
    },
    {
      id: "good-2",
      title: "Intuitive Builder Pattern",
      description: `The UIKitSettingsBuilder uses a clean, chainable API. Each method name clearly describes what it does, no guessing required.`,
      codeBlock: ``
    },
    {
      id: "good-3",
      title: "Modular Components",
      description: `Each component works independently. Components like MessageList, MessageHeader, and MessageComposer work independently and compose beautifully. You can use just what you need.`,
      codeBlock: `// Use individual components as needed
<CometChatMessageHeader user={selectedUser} />
<CometChatMessageList user={selectedUser} />
<CometChatMessageComposer user={selectedUser} />
`
    },
    {
      id: "good-4",
      title: "CSS Variables Support",
      description: `Theming is straightforward with CSS variables. Override the defaults without specificity battles or !important hacks. Just set the variables and the entire UI updates.`,
      codeBlock: `/* Easy theme customization */
:root {
  --cometchat-primary-color: #6366f1;
  --cometchat-background-color: #ffffff;
  --cometchat-text-color: #1f2937;
  --cometchat-border-radius: 12px;
}`
    },
    {
      id: "good-5",
      title: "Good TypeScript Types",
      description: `Full TypeScript support with proper types for User, Group, Conversation, and Call entities. IDE autocomplete works well.`,
      codeBlock: ``
    },
    {
      id: "good-6",
      title: "Copy-Paste Friendly Examples",
      description: `Documentation provides ready-to-use code snippets that work out of the box. You can copy examples directly into your project and they just work — no hunting for missing imports or configurations.`,
    },
    {
      id: "good-7",
      title: "Good Default Behaviors",
      description: `Components work sensibly without extensive configuration. Message lists auto-scroll, timestamps format nicely, avatars show initials as fallbacks — the defaults are production-ready.`,
    },
    {
      id: "good-8",
      title: "Realistic Sample App",
      description: `The GitHub sample app demonstrates real-world implementation patterns. It's helpful for understanding how pieces fit together beyond basic documentation examples.`,
    },
  ];

  const improvementsDX: DXItem[] = [
    {
      id: "improve-0",
      title: "No Visual Feedback on Initialization Errors",
      description: `When something goes wrong during initialization, there's no error message displayed on the screen. The UI remains completely blank, and developers need to open browser DevTools to find out what went wrong — an extra debugging step that could be avoided.

For example, using an incorrect APP_ID results in a blank screen. The error "The appId does not exist in region" only appears in the console/network tab.`,
      image: noAppIdError
    },
    {
      id: "improve-1",
      title: "Initialization Pattern Could Be More React-Friendly",
      description: `The current setup wraps the React app (createRoot) inside nested .then() callbacks. This means React only gets created after all promises succeed — if any fail, there's no React app to show errors.

A more idiomatic approach would be to mount React first, then handle initialization inside using useEffect.`,
      codeBlock: `❌ CURRENT PATTERN (CometChat Docs)

main.tsx
└── CometChatUIKit.init()
    └── .then(() => {                      ← Promise 1
        └── getLoggedinUser()
            └── .then(() => {              ← Promise 2
                └── login()
                    └── .then(() => {      ← Promise 3
                        └── createRoot().render(<App />) ← React starts HERE!
                    })})})

✅ SUGGESTED PATTERN (React-Friendly)

main.tsx
└── createRoot().render(<App />)    ← React starts IMMEDIATELY
    └── <App />
        └── useEffect(() => {
            └── Initialize CometChat here
                └── Show loading while initializing
                └── Show error if something fails
                └── Show app when ready
        })`
    },
    {
      id: "improve-2",
      title: "Feature Dependencies Need Better Visibility",
      description: `The documentation shows a UI preview with certain features (like video/voice call buttons in the header). However, when following the exact setup steps, the actual UI doesn't match — these elements are missing.

This is because some features require additional setup (like enabling CallingExtension) that isn't mentioned in the basic integration guide. A clearer indication of which features need extra configuration would save debugging time.`,
      images: [
        { src: encircledMissingItems, caption: "Documentation shows call buttons in header (circled in red)" },
        { src: fullPageMissingItems, caption: "Actual UI after following setup — call buttons are missing" }
      ]
    },
    {
      id: "improve-3",
      title: "Prop Naming Consistency (Minor)",
      description: `Different components use different prop names for the same concept (highlighting the selected item). While not a blocker, standardizing to a single pattern like "selected" or "active" everywhere would make the API more predictable.`,
      codeBlock: `CURRENT: Different names for same concept

<CometChatConversations activeConversation={...} />
<CometChatUsers         activeUser={...} />
<CometChatGroups        activeGroup={...} />
<CometChatCallLogs      activeCall={...} />

SUGGESTED: Consistent naming

<CometChatConversations selected={...} />
<CometChatUsers         selected={...} />
<CometChatGroups        selected={...} />
<CometChatCallLogs      selected={...} />`
    },
    {
      id: "improve-4",
      title: "Extensions Require Manual UI Implementation",
      description: `Some extensions like "Message Shortcuts" fetch data correctly but don't integrate with UI Kit components. For example, shortcuts are fetched via API but the MessageComposer doesn't auto-expand them — developers must build the UI themselves.`,
      codeBlock: `// Shortcuts load successfully ✅
CometChat.callExtension('message-shortcuts', 'GET', 'v1/fetch')
  .then(response => {
    // { "!hbd": "Happy Birthday! 🥳", "!ty": "Thank you!" }
  });

// But MessageComposer doesn't use them ❌
<CometChatMessageComposer />
// User types "!hbd" → sends "!hbd" literally
// Expected: auto-expand to "Happy Birthday! 🥳"

// Developer must build custom shortcut UI manually`
    },
    {
      id: "improve-5",
      title: "Accessibility Documentation Missing",
      description: `The documentation doesn't mention accessibility features like keyboard navigation, screen reader support, or ARIA attributes.`,
    },
  ];

  const uxSuggestions: DXItem[] = [
    {
      id: "ux-1",
      title: "Emoji & Sticker Picker Closes Too Quickly",
      description: `The emoji and sticker picker automatically closes immediately after selecting an item. This forces users to reopen the picker for each emoji/sticker they want to add.

A better UX pattern (used by WhatsApp, Slack, Discord) would be to keep the picker open until the user either:
• Clicks outside the picker area
• Explicitly closes it via a close button
• Presses Escape`,
    },
    {
      id: "ux-2",
      title: "Message Info Shows '---' for Unread Messages",
      description: `In the message info panel, when a message hasn't been read yet, the "Delivered" field displays "---" which isn't very informative.

A more user-friendly approach would be to:
• Show "Not read yet" or "Pending" instead of "---"
• Display the actual delivery timestamp for "Delivered"
`,
      image: emptyDelivered
    },
    {
      id: "ux-3",
      title: "No Client-Side Message Caching Between Chat Switches",
      description: `When switching between conversations, messages are fetched fresh every time, even for recently viewed chats. This causes unnecessary loading delays and repeated API calls.

For example:
• Open Chat A → Messages load (API call)
• Switch to Chat B → Messages load (API call)
• Switch back to Chat A → Messages load AGAIN (another API call)
`,    },
    {
      id: "ux-4",
      title: "Browser Recording Indicator Persists After Audio Recording Stops",
      description: `When recording an audio message, the browser's tab shows a recording indicator (red dot). However, after the user stops recording and the audio preview is displayed, the browser tab still shows the recording indicator — suggesting the microphone is still active.
`,
      image: wrongAudioIcon
    },
  ];

  const sections: Record<string, Section> = {
    good: { 
      items: goodDX, 
      emoji: "✅", 
      title: "Strengths", 
      color: "#10b981" 
    },
    improvements: { 
      items: improvementsDX, 
      emoji: "💡", 
      title: "Opportunities for Enhancement", 
      color: "#6366f1" 
    },
    ux: {
      items: uxSuggestions,
      emoji: "🎨",
      title: "UX Suggestions",
      color: "#f59e0b"
    },
  };

  return (
    <div className="landing-page">
      <header className="hero-section">
        <h1 className="hero-title">
          <span className="" style={{ color: "#7c3aed" }}>CometChat</span> UI Kit
          <br />
          Developer Experience Review
        </h1>
        <button className="cta-button" onClick={() => navigate("/demo-ui")}>
          <span>Launch Live Demo</span>
          <span className="cta-arrow">→</span>
        </button>
        <p className="cta-hint">See the actual CometChat integration in action</p>
      </header>

      <section className="faq-section">
        {Object.entries(sections).map(([key, section]) => (
          <div key={key} className="faq-category" style={{ "--category-color": section.color } as React.CSSProperties}>
            <div className="faq-category-header">
              <span className="faq-category-emoji">{section.emoji}</span>
              <div className="faq-category-text">
                <h2 className="faq-category-title">{section.title}</h2>
              </div>
              <span className="faq-category-count">{section.items.length} items</span>
            </div>

            <div className="faq-items">
              {section.items.map((item) => {
                const isOpen = openItems.has(item.id);
                return (
                  <div 
                    key={item.id} 
                    className={`faq-item ${isOpen ? "open" : ""}`}
                  >
                    <button 
                      className="faq-item-header"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-item-title">{item.title}</span>
                      <span className={`faq-item-icon ${isOpen ? "open" : ""}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </button>
                    <div className={`faq-item-content ${isOpen ? "open" : ""}`}>
                      <div className="faq-item-content-inner">
                        <p 
                          className="faq-item-description"
                          dangerouslySetInnerHTML={{ 
                            __html: item.description
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                        
                        {item.image && (
                          <div className="faq-item-image">
                            <img src={item.image} alt="Screenshot" />
                          </div>
                        )}

                        {item.images && (
                          <div className="faq-item-images">
                            {item.images.map((img, idx) => (
                              <div key={idx} className="faq-item-image">
                                <img src={img.src} alt={img.caption} />
                                <span className="image-caption">{img.caption}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {item.codeBlock && (
                          <div className="faq-item-codeblock">
                            <pre><code>{item.codeBlock}</code></pre>
                          </div>
                        )}
                        
                        {item.example && (
                          <div className="faq-item-example">
                            <code>{item.example}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <footer className="landing-footer">
        <p>Built with React + TypeScript + Vite</p>
        <p className="footer-credit">DX Review by Aanshi</p>
      </footer>
    </div>
  );
};
