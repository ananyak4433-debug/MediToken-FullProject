// import React from "react";
// import "./ChatBot.module.css";

// const ChatLauncher = ({ openChat }) => {
//   return (
//     <button className="chat-launcher" onClick={openChat}>
//       💬
//     </button>
//   );
// };

// export default ChatLauncher;




// import "./ChatBot.module.css";

// export default function ChatLauncher({ openChat }) {
//   console.log("ChatLauncher Rendered");

//   return (
//     <button
//       onClick={openChat}
//       style={{
//         position: "fixed",
//         bottom: "80px",
//         right: "25px",
//         width: "50px",
//         height: "50px",
//         borderRadius: "50%",
//         // background: "var(--green)",
//         // color: "white",
//         fontSize: "30px",
//         border: "none",
//         zIndex: 999999
//       }}
//     >
//       🤖
//     </button>
//   );
// }



import styles from "./ChatBot.module.css";

export default function ChatLauncher({ openChat }) {
  return (
    <button
      className={styles.chatLauncher}
      onClick={openChat}
    >
      🤖
    </button>
  );
}