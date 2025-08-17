const db = require("../config/db");
/* {
  "staff_id": "S001",
  "staff_name": "John Doe",
  "department": "CSE",
  "semester": 6,
  "semester_type": "Even",
  "month": "April",
  "year": 2025,
  "subject_name": "Data Structures",
  "subject_code": "CS2201",
  "type": "theory",  // or "lab"
  "total_hours": 60,
  "already_claimed": 30,
  "now_claiming": 20,
  "balance": 10,
  "attendance_records": [
    {
      "date": "2025-04-01",
      "period": 1,
      "hours": 2,
      "topic": "Stacks and Queues"
    },
    {
      "date": "2025-04-03",
      "period": 2,
      "hours": 1,
      "topic": "Linked Lists"
    }
    // ... more records
  ]
}
*/

const payslipData = async (req, res) => {
    const { subject_id, month, year } = req.body;
  
    try {
      // Get the subject row
      const [subjectRows] = await db.query(
        'SELECT * FROM subjects WHERE subject_id = ?',
        [subject_id]
      );

      const staff = await db.query(
        'select * from staff where staff_id = ?',
        [req.user.staff_id]
      );
      console.log(staff)
      if (subjectRows.length === 0) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Add derived and user-specific fields
      subjectRows.semester_type = (subjectRows.semester % 2 === 0) ? 'Even' : 'Odd';
      subjectRows.staff_id = req.user.staff_id;
      subjectRows.staff_name = staff[0].name;
      // Get attendance records
      const attendanceRecords = await db.query(
        `SELECT date, period_number, hour_count, topic 
         FROM attendance 
         WHERE staff_id = ? AND subject_id = ? AND MONTH(date) = ? AND YEAR(date) = ?`,
        [req.user.staff_id, subject_id, month, year]
      );
  
      // Attach attendance to subject
      subjectRows.attendance_records = attendanceRecords;
      console.log(subjectRows);
      res.status(200).json(subjectRows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = payslipData;