const detectIntent = async (message) => {
    const text = message.toLowerCase().trim();

    const hasDoctor =
        text.includes("dr.") ||
        text.includes("doctor") ||
        text.startsWith("dr ");

    const hasDate =
        text.includes("today") ||
        text.includes("tomorrow");

    const hasTime =
        /\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i.test(text);

    let intent = "GENERAL_QUERY";
    let doctor = null;
    let department = null;
    let date = null;
    let time = null;

    // -----------------------------
    // DATE DETECTION
    // -----------------------------
    if (text.includes("today")) {
        date = "today";
    } else if (text.includes("tomorrow")) {
        date = "tomorrow";
    } else if (text.includes("next week")) {
        date = "next_week";
    }

    // dd/mm/yyyy or dd-mm-yyyy
    const dateRegex = /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\b/;
    const dateMatch = text.match(dateRegex);

    if (dateMatch) {
        date = dateMatch[0];
    }

    // -----------------------------
    // TIME DETECTION
    // -----------------------------
    const timeRegex = /\b(\d{1,2})(:\d{2})?\s?(am|pm)\b/i;
    const timeMatch = text.match(timeRegex);

    if (timeMatch) {
        time = timeMatch[0];
    }
    // -----------------------------
    // CANCEL APPOINTMENT
    // -----------------------------
    if (
        text.includes("cancel appointment") ||
        text.includes("cancel my appointment") ||
        text.includes("cancel") ||
        text.includes("delete appointment") ||
        text.includes("remove appointment")
    ) {
        intent = "CANCEL_APPOINTMENT";
    }

    // -----------------------------
    // BOOK APPOINTMENT
    // -----------------------------
    if (
        text.includes("book") ||
        text.includes("appointment") ||
        text.includes("schedule") ||
        text.includes("consult")
    ) {
        intent = "BOOK_APPOINTMENT";
    }


    // -----------------------------
    // RESCHEDULE
    // -----------------------------
    else if (
        text.includes("reschedule") ||
        text.includes("change appointment") ||
        text.includes("move appointment")
    ) {
        intent = "RESCHEDULE_APPOINTMENT";
    }

    // -----------------------------
    // TRACK TOKEN
    // -----------------------------
    else if (
        text.includes("track token") ||
        text.includes("track my token") ||
        text.includes("token status") ||
        text.includes("current token") ||
        text === "track token"
    ) {
        intent = "TRACK_TOKEN";
    }


    else if (
        text.includes("track token") ||
        text.includes("track my token") ||
        text.includes("where is my token") ||
        text.includes("token status")
    ) {
        intent = "TRACK_TOKEN";
    }

    // -----------------------------
    // GET APPOINTMENTS
    // -----------------------------
    else if (
        text.includes("appointment") ||
        text.includes("appointments") ||
        text.includes("my booking") ||
        text.includes("my bookings") ||
        text.includes("next appointment") ||
        text.includes("do i have")
    ) {
        intent = "GET_APPOINTMENTS";
    }
    // -----------------------------
    // DOCTOR INFO
    // -----------------------------
    else if (
        text.includes("doctor") ||
        text.includes("dr.") ||
        text.includes("dr ") ||
        text.includes("specialist")
    ) {
        intent = "DOCTOR_INFO";
    }

    // -----------------------------
    // DEPARTMENT INFO
    // -----------------------------
    else if (
        text.includes("department") ||
        text.includes("cardiology") ||
        text.includes("orthopedic") ||
        text.includes("orthopaedic") ||
        text.includes("neurology") ||
        text.includes("pharmacy") ||
        text.includes("dermatology") ||
        text.includes("ent") ||
        text.includes("gynaecology") ||
        text.includes("gynecology") ||
        text.includes("pediatrics")
    ) {
        intent = "DEPARTMENT_INFO";
    }

    // -----------------------------
    // GREETING
    // -----------------------------
    else if (
        text === "hi" ||
        text === "hello" ||
        text === "hey" ||
        text === "good morning" ||
        text === "good afternoon" ||
        text === "good evening"
    ) {
        intent = "GREETING";
    }

    // -----------------------------
    // THANK YOU
    // -----------------------------
    else if (
        text.includes("thank you") ||
        text.includes("thanks") ||
        text.includes("thanks a lot") ||
        text.includes("thank you so much") ||
        text.includes("thx") ||
        text.includes("ty") ||
        text.includes("appreciate it") ||
        text.includes("much appreciated")
    ) {
        intent = "THANK_YOU";
    }

    // -----------------------------
    // GOODBYE
    // -----------------------------
    else if (
        text.includes("bye") ||
        text.includes("goodbye") ||
        text.includes("see you")
    ) {
        intent = "GOODBYE";
    }

    // -----------------------------
// NO / END CONVERSATION
// -----------------------------
else if (
    text === "no" ||
    text === "no thanks" ||
    text === "no thank you" ||
    text === "that's all" ||
    text === "thats all" ||
    text === "nothing else" ||
    text === "nothing" ||
    text === "all good"
) {
    intent = "END_CONVERSATION";
}

else if (
    text === "yes" ||
    text === "yeah" ||
    text === "yep" ||
    text === "sure" ||
    text === "ok" ||
    text === "okay"||
    text === "OK" ||
    text === "okey" || text === "Ok"
) {
    intent = "AFFIRMATIVE";
}

    console.log("Detected Intent:", {
        intent,
        doctor,
        department,
        date,
        time
    });

    return {
        intent,
        doctor,
        department,
        date,
        time
    };
};

module.exports = {
    detectIntent
};