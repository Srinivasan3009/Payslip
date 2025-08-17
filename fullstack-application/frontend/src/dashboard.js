/*import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import StaffInfo from './dashboard/StaffInfo';
import SubjectTable from './dashboard/SubjectTable';

const Dashboard = () => {
  const navigate = useNavigate();
  const logoUrl = './aserts/logo.png';


  useEffect(() => {
    async function fetchStaffData() {
      try {
        const res = await fetch('http://localhost:5870/api/staff', {
          method: 'GET',
          credentials: 'include'
        });

        if (!res.ok) throw new Error('Staff fetch failed');
        const data = await res.json();
        setStaffData(data);
        fetchSubjects(data.staff_id);
      } catch (err) {
        setError(err.message);
      }
    }

    async function fetchSubjects(staffId) {
      try {
        const res = await fetch(`http://localhost:5870/api/staff/${staffId}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Subjects fetch failed');
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchStaffData();
  }, []);

  const editSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({ ...subject });
  };

  const deleteSubject = async (subject) => {
    try {
      alert("Deletion is submitted");
      const res = await fetch('http://localhost:5870/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ subject_id: subject.subject_id })
      });

      if (!res.ok) throw new Error('Deletion failed');
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };



  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5870/api/update/${formData.subject_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();

      setSubjects(prev =>
        prev.map(sub => (sub.subject_id === updated.subject_id ? updated : sub))
      );

      handleModalClose();
    } catch (err) {
      alert("Failed to update subject.");
      console.error(err);
    }
  };


  

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1976d2', color: 'white' }}>
        <img src={logoUrl} alt="University Logo" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
        <h1>University College of Engineering, Nagercoil</h1>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Welcome to the Dashboard</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <StaffInfo staff={staffData} />
        <button onClick={() => navigate('/AddSubjectForm')}>Add Subject</button>
        <SubjectTable
          subjects={subjects}
          editSubject={editSubject}
          deleteSubject={deleteSubject}
          openAttendanceForm={openAttendanceForm}
        />

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          style={{ padding: '10px 20px', marginTop: '20px' }}
        >
          Logout
        </button>
      </div>

      {editingSubject && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.box}>
            <h3>Edit Subject</h3>
            <form onSubmit={handleFormSubmit} className="container mt-3">
              <div className="row">
                {[
                  "subject_code", "subject_name", "subject_type", "semester",
                  "total_hours", "remaining_hours", "year_no", "department",
                  "class_name", "regulation", "type"
                ].map((field, index) => (
                  <div className="col-md-6 mb-3" key={index}>
                    <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                    <input
                      type={["total_hours", "remaining_hours"].includes(field) ? "number" : "text"}
                      className="form-control"
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleFormChange}
                    />
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default Dashboard;
*/
import './dashboard/dashboard.css';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import StaffInfo from './dashboard/StaffInfo';
import SubjectTable from './dashboard/SubjectTable';

const Dashboard = () => {
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  const [addAttendance, setAttendance] = useState(null);
  const [payslipform, setPayslipform] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({});
  const [attendanceData, setAttendanceData] = useState({
    topic: '',
    period_no: '',
    date: '',
    hour_count: '',
  });
  const [payslipData, setPayslipData] = useState({
    subject_id :'',
    month:'',
    year:''
  });
  const handlePayslip = () => {
    setPayslipform(null);
    navigate('/payslip', {
      state: {
        subjectId: Number(payslipData.subject_id),
        month: Number(payslipData.month),
        year: Number(payslipData.year),
      }
    });
  };

  useEffect(() => {
    async function fetchStaffData() {
      try {
        const res = await fetch('http://localhost:5870/api/staff', {
          method: 'GET',
          credentials: 'include'
        });

        if (!res.ok) throw new Error('Staff fetch failed');
        const data = await res.json();
        setStaffData(data);
        fetchSubjects(data.staff_id);
      } catch (err) {
        setError(err.message);
      }
    }
    async function fetchSubjects(staffId) {
      try {
        const res = await fetch(`http://localhost:5870/api/staff/${staffId}`, {
          method: 'GET',
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Subjects fetch failed');
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchStaffData();
  }, []);

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData(prev => ({ ...prev, [name]: value }));
  };

  const editSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({ ...subject });
  };

  const payslipLoad= () =>{
    setPayslipform(true);
  };

  const deleteSubject = async (subject) => {
    if(window.confirm('Are you sure you want to delete this subject record?')){
    try {
      alert("Deletion is submitted");
      const res = await fetch('http://localhost:5870/api/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ subject_id: subject.subject_id }) // ✅ use actual value
      });
  
      if (!res.ok) throw new Error('Deletion failed');
      navigate('/');
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  }
  };

  const openAttendanceForm = (subject) => {
    setAttendance(subject);
    setAttendanceData({
      subject_id: subject.subject_id,
      topic: '',
      period_no: '',
      date: '',
      hour_count: ''
    });
  };

  const handleModalClose = () => {
    setEditingSubject(null);
    setAttendance(null);
    setFormData({});
    setPayslipData({})
    setPayslipform(null);
    setAttendanceData({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const payload = {
        ...attendanceData,
        subject_id: addAttendance.subject_id,
        subject_code: addAttendance.subject_code,
        subject_name: addAttendance.subject_name
      };
  
      const res = await fetch(`http://localhost:5870/api/addAttendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) throw new Error('Attendance submission failed');
  
      alert("Attendance submitted successfully!");
      handleModalClose();
      navigate('/Attendance');
    } catch (err) {
      alert("Failed to submit attendance.");
      console.error(err);
    }
  };

  const handleFormSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5870/api/update/${formData.subject_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();

      // Update the list in state
      setSubjects(prev =>
        prev.map(sub => (sub.subject_id === updated.subject_id ? updated : sub))
      );

      handleModalClose(); // Close modal
    } catch (err) {
      alert("Failed to update subject.");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
        <div className="form-card" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderBottom: '2px solid #0ef',
          padding: '1.5rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <img src='./ucen.png' alt="Logo" style={{ height: '100px' }} />
            <div>
              <h5>UNIVERSITY COLLEGE OF ENGINEERING NAGERCOIL</h5>
              <h6>(A Constituent College of Anna University, Chennai)</h6>
              <h6>Nagercoil - 629004</h6>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }} className='form-card' >
          <h2>Welcome to the Dashboard</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <StaffInfo staff={staffData} />
          <button onClick={() => navigate('/AddSubjectForm')} className="btn-submit">Add Subject</button>
          
          <button
              onClick={() => navigate('/attendance')}
              className="btn-submit"
            >
              Attendance Entry
            </button>
          <button
            onClick={payslipLoad}
            className="btn-submit"
          >
             Payslip
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            } }
            style={{ marginTop: '20px' }}
            className="btn-submit"
          >
            Logout
          </button>
          <SubjectTable
            subjects={subjects}
            editSubject={editSubject}
            deleteSubject={deleteSubject}
            openAttendanceForm={openAttendanceForm} className="container"/>
        </div>

        {/* Edit Modal */}
        {editingSubject && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 999
          }}>
            <div style={{
              backgroundColor: 'white', padding: 20,
              borderRadius: 8, width: '400px'
            }} 
            >
              <h3>Edit Subject</h3>
              <form onSubmit={handleFormSubmit} className=" mt-3">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Subject Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject_code"
                      value={formData.subject_code || ''}
                      onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Subject Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject_name"
                      value={formData.subject_name || ''}
                      onChange={handleFormChange} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Subject Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subject_type"
                      value={formData.subject_type || ''}
                      onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Semester</label>
                    <input
                      type="text"
                      className="form-control"
                      name="semester"
                      value={formData.semester || ''}
                      onChange={handleFormChange} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Total Hours</label>
                    <input
                      type="number"
                      className="form-control"
                      name="total_hours"
                      value={formData.total_hours || ''}
                      onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Remaining Hours</label>
                    <input
                      type="number"
                      className="form-control"
                      name="remaining_hours"
                      value={formData.remaining_hours || ''}
                      onChange={handleFormChange} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Year No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="year_no"
                      value={formData.year_no || ''}
                      onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Department</label>
                    <input
                      type="text"
                      className="form-control"
                      name="department"
                      value={formData.department || ''}
                      onChange={handleFormChange} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Class Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="class_name"
                      value={formData.class_name || ''}
                      onChange={handleFormChange} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Regulation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="regulation"
                      value={formData.regulation || ''}
                      onChange={handleFormChange} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Type</label>
                    <input
                      type="text"
                      className="form-control"
                      name="type"
                      value={formData.type || ''}
                      onChange={handleFormChange} />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn-submit">Update</button>
                  <button type="button" className="btn-submit" onClick={handleModalClose}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {addAttendance && (
          <div style={modalStyles.overlay}>
            <div style={modalStyles.box}>
              <h3>Submit Attendance</h3>
              <form onSubmit={handleAttendanceSubmit} className="container mt-3">
                <div className="row">
                  {["date", "period_number", "topic", "hour_count"].map((field, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                      <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                      <input
                        type={field === "date" ? "date" : field === "topic" ? "text" : "number"}
                        className="form-control"
                        name={field}
                        value={attendanceData[field] || ''}
                        onChange={handleAttendanceChange}
                        required />
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {payslipform && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 999
          }}>
            <div style={{
              backgroundColor: 'white', padding: 20,
              borderRadius: 8, width: '400px'
            }}>
              <h3>Generate Payslip</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                handlePayslip();
              } }>
                <div className="mb-3">
                  <label>Subject ID</label>
                  <input
                    type="number"
                    name="subject_id"
                    value={payslipData.subject_id}
                    onChange={(e) => setPayslipData(prev => ({ ...prev, subject_id: e.target.value }))}
                    className="form-control"
                    required />
                </div>
                <div className="mb-3">
                  <label>Month</label>
                  <input
                    type="number"
                    name="month"
                    value={payslipData.month}
                    onChange={(e) => setPayslipData(prev => ({ ...prev, month: e.target.value }))}
                    className="form-control"
                    placeholder="e.g., April"
                    required />
                </div>
                <div className="mb-3">
                  <label>Year</label>
                  <input
                    type="number"
                    name="year"
                    value={payslipData.year}
                    onChange={(e) => setPayslipData(prev => ({ ...prev, year: e.target.value }))}
                    className="form-control"
                    placeholder="e.g., 2025"
                    required />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary">Generate</button>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 999
  },
  box: {
    backgroundColor: 'white', padding: 20,
    borderRadius: 8, width: '400px'
  }
};

export default Dashboard;
