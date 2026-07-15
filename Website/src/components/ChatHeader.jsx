import styles from "./ChatBot.module.css";

export default function ChatHeader({ closeChat }) {
    return (
        <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
                <h3>MediToken Assistant</h3>
                <span className={styles.onlineStatus}>
                    ● Online
                </span>
            </div>

            <div className={styles.headerButtons}>
                <button
                    title="Clear Chat"
                    onClick={() => {
                        localStorage.removeItem("chatHistory");
                        window.location.reload();
                    }}
                >
                    🗑
                </button>

                <button
                    title="Close"
                    onClick={closeChat}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}