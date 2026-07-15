import { useEffect, useRef } from "react";
import styles from "./ChatBot.module.css";

export default function ChatWindow({
    messages,
    isTyping,
    onQuickAction,
    clickedOptions,
    setClickedOptions
}) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, isTyping]);

    return (
        <div className={styles.chatWindow}>
            {messages.map((message, index) => (
                <div
                    key={message.id}
                    className={`${styles.message} ${message.sender === "user"
                        ? styles.user
                        : styles.bot
                        }`}
                >
                    <>
                        {message.type === "appointment" && message.appointment && (
                            <div className={styles.appointmentCard}>
                                <h4>📅 Next Appointment</h4>

                                <p><strong>Doctor:</strong> {message.appointment.doctor}</p>
                                <p><strong>Department:</strong> {message.appointment.department}</p>
                                <p><strong>Date:</strong> {message.appointment.date}</p>
                                <p><strong>Time:</strong> {message.appointment.time}</p>
                                <p><strong>Token:</strong> #{message.appointment.token}</p>
                            </div>
                        )}


                        {message.type === "token" && message.token && (
                            <div className={styles.appointmentCard}>
                                <h4>🎫 Token Status</h4>

                                <p><strong>Doctor:</strong> {message.token.doctor}</p>
                                <p><strong>Department:</strong> {message.token.department}</p>
                                <p><strong>Your Token:</strong> #{message.token.token}</p>
                                <p><strong>Current Token:</strong> #{message.token.currentToken}</p>
                                <p><strong>Patients Ahead:</strong> {message.token.patientsAhead}</p>
                                <p><strong>Estimated Wait:</strong> {message.token.estimatedWait} mins</p>
                                <p><strong>Status:</strong> {message.token.status}</p>
                            </div>
                        )}

                        {message.type === "appointment_selection" ? (
                            <div className="appointment-selection">
                                <p>{message.reply}</p>

                                {message.appointments?.map((appt) => (
                                    <div
                                        key={appt.appointmentId}
                                        className={styles.appointmentSelectionCard}>
                                        <h4>{appt.doctor}</h4>
                                        <p><b>Department:</b> {appt.department}</p>
                                        <p><b>Date:</b> {appt.date}</p>
                                        <p><b>Time:</b> {appt.time}</p>
                                        <p><b>Token:</b> #{appt.token}</p>
                                        <button
                                            className={styles.trackAppointmentBtn}
                                            onClick={() => {
                                                console.log("Clicked:", appt.appointmentId);

                                                onQuickAction({
                                                    action: "TRACK_APPOINTMENT",
                                                    appointmentId: appt.appointmentId
                                                });
                                            }}
                                        >
                                            Track This Appointment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>{message.reply}</p>
                        )}

                        {message.type === "cancel_selection" && (
                            <div>
                                <p>{message.reply}</p>

                                {message.appointments?.map(appt => (
                                    <div
                                        key={appt.appointmentId}
                                        className={styles.appointmentSelectionCard}
                                    >
                                        <h4>{appt.doctor}</h4>

                                        <p><b>Department:</b> {appt.department}</p>
                                        <p><b>Date:</b> {appt.date}</p>
                                        <p><b>Time:</b> {appt.time}</p>
                                        <p><b>Token:</b> #{appt.token}</p>

                                        <button
                                            className={styles.cancelBtn}
                                            onClick={() =>
                                                onQuickAction({
                                                    action: "SELECT_CANCEL_APPOINTMENT",
                                                    appointmentId: appt.appointmentId
                                                })
                                            }
                                        >
                                            Cancel This Appointment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}


                        {message.type === "confirm_cancel" && (
                            <div className={styles.appointmentSelectionCard}>
                                <h4>⚠️ Confirm Cancellation</h4>

                                <p><b>Doctor:</b> {message.appointment.doctor}</p>
                                <p><b>Department:</b> {message.appointment.department}</p>
                                <p><b>Date:</b> {message.appointment.date}</p>
                                <p><b>Time:</b> {message.appointment.time}</p>
                                <p><b>Token:</b> #{message.appointment.token}</p>

                                <div className={styles.quickActions}>
                                    <button
                                        onClick={() => {
                                            console.log("Confirmation message:", message);
                                            console.log("appointmentId:", message.appointmentId);

                                            onQuickAction({
                                                action: "CONFIRM_CANCEL",
                                                appointmentId: message.appointmentId
                                            });
                                        }}
                                    >
                                        Yes, Cancel
                                    </button>

                                    <button
                                        onClick={() =>
                                            onQuickAction({
                                                action: "CANCEL_CANCEL"
                                            })
                                        }
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        )}

                        {message.type !== "appointment" && message.type !== "token" && (
                            <>
                                <div>{message.text}</div>

                                {message.type === "options" && message.options?.length > 0 && (
                                    <div className={styles.quickActions}>

                                        {message.options.map((option, index) => {

                                            const label = typeof option === "object" ? option.label : option;
                                            const action = typeof option === "object" ? option.action : null;

                                            let payload = {};
                                            switch (message.optionType) {

                                                case "department":
                                                    payload = {
                                                        action: "SELECT_DEPARTMENT",
                                                        department: label
                                                    };
                                                    break;

                                                case "doctor":
                                                    payload = {
                                                        action: "SELECT_DOCTOR",
                                                        doctor: label
                                                    };
                                                    break;

                                                case "date":
                                                    if (label === "📅 Choose Another Date") {
                                                        payload = {
                                                            action: "OPEN_DATE_PICKER"
                                                        };
                                                    } else {
                                                        payload = {
                                                            action: "SELECT_DATE",
                                                            date: label.toLowerCase()
                                                        };
                                                    }
                                                    break;

                                                case "slot":
                                                    payload = {
                                                        action: "SELECT_SLOT",
                                                        time: label
                                                    };
                                                    break;

                                                case "confirm":
                                                    payload =
                                                        label === "Confirm"
                                                            ? { action: "CONFIRM_BOOKING" }
                                                            : { action: "CANCEL_BOOKING" };
                                                    break;

                                                default:
                                                    switch (label) {
                                                        case "📅 Book Appointment":
                                                            payload = { action: "BOOK_APPOINTMENT" };
                                                            break;

                                                        case "📋 My Bookings":
                                                            payload = { action: "MY_BOOKINGS" };
                                                            break;

                                                        case "🎫 Track Token":
                                                            payload = { action: "TRACK_TOKEN" };
                                                            break;

                                                        case "❌ Cancel Appointment":
                                                            payload = { action: "CANCEL_APPOINTMENT" };
                                                            break;

                                                        default:
                                                            payload = label;
                                                    }
                                            }

                                            return (
                                                <button
                                                    key={index}
                                                    disabled={!!clickedOptions[message.id]}
                                                    onClick={() => {

                                                        setClickedOptions(prev => ({
                                                            ...prev,
                                                            [message.id]: label
                                                        }));

                                                        onQuickAction(payload);

                                                    }}
                                                >
                                                    {clickedOptions[message.id] === label
                                                        ? `✔ ${label}`
                                                        : label}
                                                </button>
                                            );

                                        })}

                                    </div>
                                )}
                            </>
                        )}
                    </>

                    {message.type === "my_bookings" && (
                        <div>
                            <p>{message.reply}</p>

                            {message.appointments.map(appt => (
                                <div
                                    key={appt.appointmentId}
                                    className={styles.appointmentSelectionCard}
                                >
                                    <h4>{appt.doctor}</h4>
                                    <p><b>Department:</b> {appt.department}</p>
                                    <p><b>Hospital:</b> {appt.hospital}</p>
                                    <p><b>Date:</b> {appt.date}</p>
                                    <p><b>Time:</b> {appt.time}</p>
                                    <p><b>Token:</b> #{appt.token}</p>
                                    <p><b>Status:</b> {appt.status}</p>
                                </div>
                            ))}
                        </div>
                    )}



                    {index === 0 && message.sender === "bot" && (
                        <div className={styles.quickActions}>
                            <button
                                onClick={() =>
                                    onQuickAction({
                                        action: "BOOK_APPOINTMENT"
                                    })
                                }
                            >
                                📅 Book Appointment
                            </button>

                            <button onClick={() =>
                                onQuickAction({
                                    action: "MY_BOOKINGS"
                                })
                            }>
                                📋 My Bookings
                            </button>

                            <button
                                onClick={() =>
                                    onQuickAction({
                                        action: "TRACK_TOKEN"
                                    })
                                }
                            >
                                🎫 Track Token
                            </button>

                            <button
                                onClick={() =>
                                    onQuickAction({
                                        action: "CANCEL_APPOINTMENT"
                                    })
                                }
                            >
                                ❌ Cancel Appointment
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {isTyping && (
                <div className={`${styles.message} ${styles.bot}`}>
                    <div className={styles.typing}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}

            <div ref={bottomRef}></div>
        </div>
    );


}

