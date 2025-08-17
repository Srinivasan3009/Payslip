const db = require('../config/db');  // Assuming you have your DB configuration in a separate file

// Function to add attendance and update payslip
async function addAttendance(req, res) {
  const {subject_id, topic,subject_name, period_number, date, type, hour_count } = req.body;

  // Step 1: Insert attendance data
  try {
    const result = await db.query(
      'INSERT INTO attendance (subject_name,  staff_id, subject_id, topic, period_number, date, hour_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [subject_name,req.user.staff_id, subject_id, topic, period_number, date, hour_count]
    );
    // Step 2: After inserting the attendance, update the payslip
    //await updatePayslip(req.user.staff_id, date); 

    res.status(200).json({
      message: 'Attendance added successfully and payslip updated!',
      data: result.toLocaleString,
    });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error adding attendance', error: error.message });
  }
}
/*
// Function to update payslip based on the staff_id and date
async function updatePayslip(staff_id, date) {
  const month = new Date(date).getMonth() + 1;  // Get month from the date
  const year = new Date(date).getFullYear();  // Get year from the date

  const attendanceData = await db.query(
    'SELECT SUM(hour_count) AS total_hours FROM attendance WHERE staff_id = ? AND MONTH(date) = ? AND YEAR(date) = ?',
    [staff_id, month, year]
  );
  const total_hours = attendanceData[0].total_hours || 0;

  // Step 2: Calculate the total pay
  const theory_hours = await db.query(
    'SELECT SUM(hour_count) AS theory_hours FROM attendance WHERE staff_id = ? AND type = "theory" AND MONTH(date) = ? AND YEAR(date) = ?',
    [staff_id, month, year]
  );

  const lab_hours = await db.query(
    'SELECT SUM(hour_count) AS lab_hours FROM attendance WHERE staff_id = ? AND type = "lab" AND MONTH(date) = ? AND YEAR(date) = ?',
    [staff_id, month, year]
  );
 
  const total_theory_hours = theory_hours[0].theory_hours || 0;
  const total_lab_hours = lab_hours[0].lab_hours || 0;


  console.log(total_theory_hours);
  console.log(total_lab_hours);


  const total_theory_pay = total_theory_hours * 600;  // 600 per theory hour
  const total_lab_pay = total_lab_hours * 360;  // 360 per lab hour

  // Total pay
  let total_pay = total_theory_pay + total_lab_pay;

  // Enforce max pay limit of 19990
  if (total_pay > 19990) {
    total_pay = 19990;
  }

  // Step 3: Check if the payslip for the given staff_id, month, and year already exists
  const payslip = await db.query(
    'SELECT * FROM payslips WHERE staff_id = ? AND month = ? AND year = ?',
    [staff_id, month, year]
  );

  // Step 4: If payslip exists, update it; otherwise, create a new payslip
  if (payslip.length > 0) {
    await db.query(
      'UPDATE payslips SET total_hours_taken = ?, total_amount = ? WHERE staff_id = ? AND month = ? AND year = ?',
      [total_hours, total_pay, staff_id, month, year]
    );
  } else {
    await db.query(
      'INSERT INTO payslips (staff_id, month, year, total_hours_taken, total_amount) VALUES (?, ?, ?, ?, ?)',
      [staff_id, month, year, total_hours, total_pay]
    );
  }
}*/


const getAttendance = async (req, res) => {
  const { subject_id, month, year } = req.body;
  if (!subject_id || !month || !year) {
    return res.status(400).json({ message: 'Subject ID, Month, and Year are required' });
  }
  try {
    const rows = await db.query(
      'SELECT * FROM attendance WHERE staff_id = ? AND subject_id = ? AND MONTH(date) = ? AND YEAR(date) = ?  ORDER BY date DESC',
      [ req.user.staff_id, subject_id, month, year ]
    );
    console.log("rows length");
    console.log(rows.length);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }
    console.log(rows);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Server error while fetching attendance' });
  }
};

const viewAttendance = async (req, res) => {
  try {
    const attendance = await db.query('SELECT * FROM attendance WHERE staff_id = ?  ORDER BY date DESC', [req.user.staff_id]);
    if (attendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }
    res.status(200).json(attendance);
    if (attendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }
  } catch (err) {
    console.error(err); // Optional: helpful for debugging
    res.status(500).json({ error: `${err.message}` }); // Corrected string interpolation
  }
};

const updateAttendance = async (req, res) => {
  const { attendance_id ,topic, period_number, date, type, hour_count } = req.body;

  try {
    const result = await db.query(
      'UPDATE attendance SET topic = ?, period_number = ?, date = ?, hour_count = ? WHERE attendance_id = ?',
      [topic,period_number, date, hour_count, attendance_id]
    );
    res.status(200).json({ message: 'Attendance updated successfully', data: result.toLocaleString });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ message: 'Error updating attendance', error: err.message });
  }
};

const deleteAttendance = async (req, res) => {
  const { attendance_id } = req.body;
  try {
    await db.query(
      'DELETE FROM attendance WHERE attendance_id = ?', 
      [attendance_id]
    );
    res.status(200).json({ message: 'Attendance deleted successfully' });
  } catch (err) {
    console.error('Error deleting Attendance:', err);
    res.status(500).json({ error: 'Failed to delete Attendance' });
  }
};


module.exports = {
  addAttendance,
  getAttendance,
  viewAttendance,
  updateAttendance,
  deleteAttendance
};