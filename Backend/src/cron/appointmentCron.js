const cron = require('node-cron');
const Appointment = require('../models/appointmentModel');

const startAppointmentCron = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();

      // ✅ IST offset
      const IST_OFFSET = 5.5 * 60 * 60 * 1000;

      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const startUTC = new Date(start.getTime() + IST_OFFSET);

      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const endUTC = new Date(end.getTime() - IST_OFFSET);

      const parseTime = (timeStr) => {
        if (!timeStr) return null;
        const [time, period] = timeStr.split(' ');
        let [h, m] = time.split(':').map(Number);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return h * 60 + m;
      };

      // ✅ auto-serve: booked appointments whose time has arrived
      const bookedAppointments = await Appointment.find({
        appointmentDate: { $gte: startUTC, $lte: endUTC },
        status: 'booked'
      });

      for (const appt of bookedAppointments) {
        const apptMin = parseTime(appt.appointmentTime);
        if (apptMin === null) continue;

        if (currentMin >= apptMin) {
          appt.status = 'serving';
          await appt.save();
          console.log(`✅ Token #${appt.tokenNumber} → serving`);
        }
      }

      // ✅ auto-complete: serving appointments whose slot has passed
      const servingAppointments = await Appointment.find({
        appointmentDate: { $gte: startUTC, $lte: endUTC },
        status: 'serving'
      });

      for (const appt of servingAppointments) {
        const apptMin = parseTime(appt.appointmentTime);
        if (apptMin === null) continue;

        if (currentMin >= apptMin + 15) { // ✅ 15 min slot
          appt.status = 'completed';
          await appt.save();
          console.log(`✅ Token #${appt.tokenNumber} → completed`);
        }
      }

    } catch (err) {
      console.error('Cron error:', err.message);
    }
  });

  console.log('✅ Appointment cron started');
};

module.exports = startAppointmentCron;