const Doctor = require("../models/doctorCollection");
const Department = require("../models/departmentModel");

const extractEntities = async (message) => {

    const text = message.toLowerCase().trim();

    let doctor = null;
    let department = null;
    let date = null;
    let time = null;

    // ============================================
// DATE
// ============================================

const months = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,

    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    sept: 8,
    oct: 9,
    nov: 10,
    dec: 11
};

// Today / Tomorrow

if (text.includes("today")) {
    date = "today";
}
else if (text.includes("tomorrow")) {
    date = "tomorrow";
}

// DD/MM/YYYY

const numericDate =
    text.match(/\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})\b/);

if (numericDate) {
    date = numericDate[0];
}

// July 10 / Jul 10

if (!date) {

    const match = text.match(
        /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\s+(\d{1,2})(st|nd|rd|th)?\b/i
    );

    if (match) {

        const month = months[match[1].toLowerCase()];
        const day = Number(match[2]);

        const year = new Date().getFullYear();

        const parsedDate = new Date(year, month, day);

        date = parsedDate.toLocaleDateString("en-CA");

    }

}

// 10 July

if (!date) {

    const match = text.match(
        /\b(\d{1,2})(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec)\b/i
    );

    if (match) {

        const day = Number(match[1]);

        const month = months[match[3].toLowerCase()];

        const year = new Date().getFullYear();

        const parsedDate = new Date(year, month, day);

        date = parsedDate.toLocaleDateString("en-CA");

    }

}

    // ==========================================
    // TIME
    // ==========================================

    const timeMatch = text.match(/\b(\d{1,2})(:\d{2})?\s?(am|pm)\b/i);

    if (timeMatch) {
        time = timeMatch[0];
    }

    // ==========================================
    // FIND DEPARTMENT
    // ==========================================

    const departmentDoc = await Department.findOne({
        status: "active",
        departmentName: {
            $regex: text,
            $options: "i"
        }
    }).select("departmentName");

    if (departmentDoc) {
        department = departmentDoc.departmentName;
    }

    // ==========================================
    // FIND DOCTOR
    // ==========================================

    const doctorDoc = await Doctor.findOne({
        status: "active",
        name: {
            $regex: text,
            $options: "i"
        }
    }).select("name specialization");

    if (doctorDoc) {
        doctor = doctorDoc.name;

        if (!department) {
            department = doctorDoc.specialization;
        }
    }

    return {
        doctor,
        department,
        date,
        time
    };

};

module.exports = {
    extractEntities
};