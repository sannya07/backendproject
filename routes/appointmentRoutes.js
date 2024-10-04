const express = require('express');
const Doctor = require('../models/Doctor'); // Adjust the path as needed
const router = express.Router();

router.get('/doctor/:doctorName/availability', async (req, res) => {
    const { doctorName } = req.params;
  
    try {
      // Find the doctor by name
      const doctor = await Doctor.findOne({ name: doctorName });
  
      if (!doctor) {
        return res.status(404).send("Doctor not found");
      }
  
      // Dummy data for available times (you can replace this with actual availability)
      const availableTimes = [
        '2024-10-10T09:00:00',
        '2024-10-10T10:00:00',
        '2024-10-10T11:00:00',
        '2024-10-10T14:00:00',
        '2024-10-10T15:00:00',
      ];
  
      res.render('doctorAvailability', { doctor, availableTimes });
    } catch (error) {
      console.error("Error fetching doctor:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
// Handle booking appointment
router.post('/book-appointment', async (req, res) => {
  const { disease } = req.body;

  try {
    // Find doctors that can treat the selected disease
    const doctors = await Doctor.find({ diseases: disease });
    
    // Render the dashboard with the filtered doctors
    res.render('dashboard', { doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
