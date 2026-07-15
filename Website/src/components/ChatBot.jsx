import { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import styles from "./ChatBot.module.css";
// import { sendChatMessage } from "../chatbotApi";
import { sendChatMessage } from "../api";

export default function ChatBot({ closeChat }) {

    const [isTyping, setIsTyping] = useState(false);
    const [clickedOptions, setClickedOptions] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    const defaultMessages = [
        {
            id: 1,
            sender: "bot",
            text: "👋 Welcome to MediToken! How can I help you today?"
        }
    ];

    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem("chatHistory");

        if (savedMessages) {
            return JSON.parse(savedMessages);
        }

        return defaultMessages;
    });

    useEffect(() => {
        localStorage.setItem(
            "chatHistory",
            JSON.stringify(messages)
        );
    }, [messages]);


    const sendMessage = async (
        text = "",
        payload = {}
    ) => {
        console.log("Sending:", {
            message: text,
            ...payload
        });


        if (!text.trim() && Object.keys(payload).length === 0) {
            return;
        }
        const userMessage = {
            id: Date.now(),
            sender: "user",
            text
        };

        setMessages((prev) => [...prev, userMessage]);

        setIsTyping(true);

        try {
            const data = await sendChatMessage({
                message: text,
                ...payload
            });

            const botMessage = {
    id: Date.now() + 1,
    sender: "bot",
    text: data.reply,
    type: data.type || "text",
    optionType: data.optionType || null,
    token: data.token || null,
    appointment: data.appointment || null,
    appointmentId: data.appointmentId || null,   // ✅ ADD THIS
    appointments: data.appointments || [],
    options: data.options || []
};

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "bot",
                    text: "⚠️ Unable to connect to the server. Please try again."
                }
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickAction = (payload) => {

        console.log("Quick Action:", payload);

        if (typeof payload === "string") {
            return sendMessage(payload);
        }

        if (payload.action === "OPEN_DATE_PICKER") {
            setShowDatePicker(true);
            return;
        }

        switch (payload.action) {

            // ===========================
            // HOME MENU ACTIONS
            // ===========================

            case "BOOK_APPOINTMENT":
                sendMessage("Book Appointment", {
                    action: "BOOK_APPOINTMENT"
                });
                break;

            case "TRACK_TOKEN":
                sendMessage("Track Token", {
                    action: "TRACK_TOKEN"
                });
                break;

            case "CANCEL_APPOINTMENT":
                sendMessage("Cancel Appointment", {
                    action: "CANCEL_APPOINTMENT"
                });
                break;

            // ===========================
            // BOOKING FLOW
            // ===========================

            case "SELECT_DEPARTMENT":
                sendMessage(payload.department, payload);
                break;

            case "SELECT_DOCTOR":
                sendMessage(payload.doctor, payload);
                break;

            case "SELECT_DATE":
                sendMessage(payload.date, payload);
                break;

            case "SELECT_SLOT":
                sendMessage(payload.time, payload);
                break;

            case "CONFIRM_BOOKING":
                sendMessage("Confirm", payload);
                break;

            case "CANCEL_BOOKING":
                sendMessage("Cancel", payload);
                break;

            // ===========================
            // TRACK TOKEN
            // ===========================

            case "TRACK_APPOINTMENT":

                console.log("TRACK_APPOINTMENT payload:", payload);

                sendMessage("Track This Appointment", {
                    action: "TRACK_APPOINTMENT",
                    appointmentId: payload.appointmentId
                });

                break;

            // ===========================
            // CANCEL APPOINTMENT
            // ===========================

            case "SELECT_CANCEL_APPOINTMENT":

                sendMessage("Cancel Appointment", {
                    action: "SELECT_CANCEL_APPOINTMENT",
                    appointmentId: payload.appointmentId
                });

                break;

            case "CONFIRM_CANCEL":
                sendMessage("Yes", {
                    action: "CONFIRM_CANCEL",
                    appointmentId: payload.appointmentId
                });
                break;

            case "CANCEL_CANCEL":
                sendMessage("No", {
                    action: "CANCEL_CANCEL"
                });
                break;

                case "MY_BOOKINGS":

    sendMessage("My Bookings", {
        action: "MY_BOOKINGS"
    });

    break;

            default:
                sendMessage("", payload);
        }
    };

    return (
        <div className={styles.chatbot}>
            <ChatHeader closeChat={closeChat} />

            <ChatWindow
                messages={messages}
                isTyping={isTyping}
                onQuickAction={handleQuickAction}
                clickedOptions={clickedOptions}
                setClickedOptions={setClickedOptions}
            />

            {showDatePicker && (
                <div style={{ padding: "10px" }}>
                    <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {

                            setShowDatePicker(false);

                            sendMessage(
                                e.target.value,
                                {
                                    action: "SELECT_DATE",
                                    date: e.target.value
                                }
                            );
                        }}
                    />
                </div>
            )}

            <ChatInput sendMessage={sendMessage} />
        </div>
    );
}