const db = require('../config/db');

// Create a new subject
exports.createSubject = async (req, res) => {
  const {
    subject_code,
    subject_name,
    type,
    subject_type,
    semester,
    semester_type,
    regulation,
    class_name,
    total_hours,
    remaining_hours,
    year_no,
    department,
    period
  } = req.body;
  //subject_id	staff_id	subject_code	subject_name	subject_type	semester	total_hours	remaining_hours	year_no	department	class_name	
  try {
    const result = await db.query(
      `INSERT INTO subjects 
        (semester_type, staff_id, subject_code, subject_name, subject_type,type, semester, regulation,class_name,total_hours,remaining_hours,year_no,department,period)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [semester_type,req.user.staff_id,subject_code,subject_name,subject_type,type,semester,regulation,class_name,Number(total_hours),Number(remaining_hours),year_no,department,period]
    );
    res.status(201).json({
      message: 'Subject created successfully',
      subject_id: result.insertId.toString()
    });
  } catch (err) {
    console.error('Error creating subject:', err);
    res.status(500).json({ error: 'Failed to create subject' });
  }
};

// Get all subjects for a staff
exports.getSubjectsByStaff = async (req, res) => {
  const { staff_id } = req.params;

  try {
    const subjects = await db.query(
      'SELECT * FROM subjects WHERE staff_id = ?',
      [staff_id]
    );
    res.status(200).json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

exports.listOfSubjectsByStaffId = async (req, res) => {
  try {
    const subjects = await db.query('SELECT * FROM subjects WHERE staff_id = ?', [req.user.staff_id]);
    res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects by staff ID:", err);
    res.status(500).json({ error: 'Cannot get the data from the database using the staff ID from the token' });
  }
};

exports.viewSubject = async (req, res) => {
  const { subject_id } = req.params;
  try {
    const subjects = await db.query(
      'SELECT * FROM subjects WHERE subject_id = ?',
      [subject_id]
    );
    res.status(200).json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};
// Optional: Update a subject
exports.updateSubject = async (req, res) => {
  const { subject_id } = req.params;
  const {
    subject_code,
    subject_name,
    subject_type,
    semester,
    regulation,
    class_name,
    total_hours,
    remaining_hours,
    year_no,
    department,
    type
  } = req.body;

  try {
    await db.query(
      'UPDATE subjects SET subject_code = ?, subject_name = ?,  subject_type = ?,semester = ?,regulation = ?,class_name = ?,total_hours = ?,remaining_hours = ?, year_no = ?,department = ?,type=? WHERE subject_id = ?;',
      [subject_code, subject_name, subject_type, semester, regulation, class_name, total_hours, remaining_hours, year_no, department, type, subject_id]
    );
    res.status(200).json({ message: 'Subject updated successfully' });
  } catch (err) {
    console.error('Error updating subject:', err);
    res.status(500).json({ error: 'Failed to update subject' });
  }
};

// Optional: Delete a subject
exports.deleteSubject = async (req, res) => {
  const { subject_id } = req.body;

  try {
    // First, delete all attendance records linked to this subject
    await db.query(
      'DELETE FROM attendance WHERE subject_id = ?', 
      [subject_id]
    );

    // Then, delete the subject
    await db.query(
      'DELETE FROM subjects WHERE subject_id = ?',
      [subject_id]
    );

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (err) {
    console.error('Error deleting subject:', err);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
};
