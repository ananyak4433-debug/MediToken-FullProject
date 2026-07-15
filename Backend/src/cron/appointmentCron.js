const cron = require("node-cron");
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorCollection");

const startAppointmentCron = () => {

  cron.schedule("* * * * *", async () => {

    try {

      const now = new Date();

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const doctors = await Doctor.find();

      for (const doctor of doctors) {

        const appointments = await Appointment.find({
          doctorId: doctor._id,
          appointmentDate: {
            $gte: todayStart,
            $lte: todayEnd
          },
          status: {
            $in: ["booked", "serving", "completed"]
          }
        }).sort({ tokenNumber: 1 });

        if (!appointments.length) continue;

        let currentServingFound = false;

        for (const appt of appointments) {

          // const appointmentTime = new Date(appt.appointmentDate);

          // const [time, period] =
          //   appt.appointmentTime.split(" ");

          // let [hours, minutes] =
          //   time.split(":").map(Number);

          // if (period === "PM" && hours !== 12)
          //   hours += 12;

          // if (period === "AM" && hours === 12)
          //   hours = 0;

          // appointmentTime.setHours(
          //   hours,
          //   minutes,
          //   0,
          //   0
          // );

          const appointmentTime = new Date(appt.appointmentDateTime);

          if (isNaN(appointmentTime.getTime())) {
            console.log("❌ Invalid appointmentDateTime:", appt._id);
            continue;
          }

          const endTime = new Date(
            appointmentTime.getTime() + 15 * 60000
          );

          // Patient completed
          if (now > endTime) {

            if (appt.status !== "completed") {

              appt.status = "completed";
              console.log({
                id: appt._id,
                appointmentDate: appt.appointmentDate,
                appointmentDateTime: appt.appointmentDateTime,
                appointmentTime: appt.appointmentTime
              });
              await appt.save();

              console.log(
                `✅ Token ${appt.tokenNumber} -> completed`
              );
            }

            continue;
          }

          // Current serving patient
          if (
            now >= appointmentTime &&
            now <= endTime &&
            !currentServingFound
          ) {

            currentServingFound = true;

            if (appt.status !== "serving") {

              appt.status = "serving";
              await appt.save();

              console.log(
                `🩺 Token ${appt.tokenNumber} -> serving`
              );
            }

            continue;
          }

          // Future appointments
          if (
            now < appointmentTime &&
            appt.status !== "booked"
          ) {

            appt.status = "booked";
            await appt.save();
          }
        }
      }

    } catch (err) {

      console.error(
        "Appointment Cron Error:",
        err.message
      );
    }

  });

  console.log("✅ Appointment cron started");
};

module.exports = startAppointmentCron;