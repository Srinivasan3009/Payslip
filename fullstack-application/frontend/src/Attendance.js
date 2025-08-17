import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './dashboard/dashboard.css';
import { useNavigate } from 'react-router-dom';

const Attendance = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    attendance_id: '',
    date: '',
    topic: '',
    period_number: '',
    hour_count: ''
  });
  const [addFormData, setAddFormData] = useState({
    subject_id: '',
    subject_name:'',
    date: '',
    topic: '',
    period_number: '',
    hour_count: '',
  });

  useEffect(() => {
    // Fetch subjects when component mounts
    fetchSubjects();
    initialFetchAttendance();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:5870/api/subjects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include'
      });
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const initialFetchAttendance = async () => {
    try {
      const response = await fetch('http://localhost:5870/api/viewAttendance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include'
      });
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchAttendance = async () => {
    if (!selectedSubject || !selectedMonth || !selectedYear) {
      alert('Please select all filters');
      return;
    }
    try {
      const response = await fetch('http://localhost:5870/api/getAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify({
          subject_id: selectedSubject,
          month: selectedMonth,
          year: selectedYear
        })
      });
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };
  const dateValidity = (date) => {
    const today = new Date();
    const givenDate = date
  
    // Convert both to YYYY-MM-DD format (strip time entirely)
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const givenDateOnly = new Date(givenDate.getFullYear(), givenDate.getMonth(), givenDate.getDate());
  
    const diffTime = todayDateOnly - givenDateOnly;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
    if (diffDays > 6) {
      alert("Editing is only allowed within 6 days of the attendance date.");
      return;
    }
    return date;
  }
  
  const handleEdit = (attendance) => {
    setEditFormData({
      attendance_id: attendance.attendance_id,
      date: attendance.date,
      topic: attendance.topic,
      period_number: attendance.period_number,
      hour_count: attendance.hour_count
    });
    setShowEditModal(true);
  };
  const handleAdd = (attendance) => {
    setAddFormData({
      subject_id: attendance.subject_id,
      subject_name: attendance.subject_name,
    });
    setShowAddModal(true);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5870/api/updateAttendance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editFormData)
      });
      if (response.ok) {
        setShowEditModal(false);
        initialFetchAttendance(); // Refresh the attendance data
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleAttendance = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5870/api/addAttendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(addFormData)
      });
      if (response.ok) {
        setShowAddModal(false);
        initialFetchAttendance(); // Refresh the attendance data
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };


  const handleDelete = async (attendanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        const response = await fetch('http://localhost:5870/api/deleteAttendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials : 'include',
          body: JSON.stringify({ attendance_id: attendanceId })
        });
        if (response.ok) {
          initialFetchAttendance(); // Refresh the attendance data
        }
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
    }
  };

  return (
    <div className='form-container'>
      <div className="form-card" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderBottom: '2px solid #0ef',
        padding: '1.5rem',
        position: 'relative'
      }}>
        <div className="header-content" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <img src='./ucen.png' alt="Logo" style={{ height:'100px'}} />
          <div>
            <h5>UNIVERSITY COLLEGE OF ENGINEERING NAGERCOIL</h5 >
            <h6>(A Constituent College of Anna University, Chennai)</h6>
            <h6>Nagercoil - 629004</h6>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="subjectSelect" className="form-label text-white">Select Subject</label>
            <select 
              className="form-select" 
              id="subjectSelect"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="monthSelect" className="form-label text-white">Select Month</label>
            <select 
              className="form-select" 
              id="monthSelect"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="yearSelect" className="form-label text-white">Select Year</label>
            <select 
              className="form-select" 
              id="yearSelect"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={fetchAttendance}>Filter</button>
          </div>
        </div>
        <button
            onClick={() => {navigate('/dashboard')} }
            style={{ marginTop: '20px' }}
            className="btn-submit"
          >
            Dashboard
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
        
        <div className="current-semesters form-card" style={{
          backgroundColor: 'rgba(255,255,255, 0.1)',
          borderLeft: '4px solid #0ef',
          padding: '1.5rem',
        }}>
          <p><span style={{ fontWeight: 'bold', color: '#0ef' }}>Attendance Data:</span></p>
          <div className="table-responsive">
            <table className="table table-dark table-striped">
              <thead>
                <tr>
                  <th>Subject ID</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Topic</th>
                  <th>Period</th>
                  <th>Hours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
              {!Array.isArray(attendanceData) || attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">No attendance records found</td>
                </tr>
              ) : (
                attendanceData.map(record => (
                  <tr key={record.attendance_id}>
                    <td>{record.subject_id}</td>
                    <td>{record.subject_name}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.topic}</td>
                    <td>{record.period_number}</td>
                    <td>{record.hour_count}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEdit(record)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => handleDelete(record.attendance_id)}
                      >
                        Delete
                      </button>
                      <button 
                        className="btn btn-sm btn-light"
                        onClick={() => handleAdd(record)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))
              )}

              </tbody>
            </table>
          </div>
        </div>
      </div>
{showEditModal && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 999
  }}>
    <div style={{
      backgroundColor: 'white', padding: 20,
      borderRadius: 8, width: '400px'
    }}>
      <h3>Edit Attendance</h3>
      <form onSubmit={handleUpdate} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={editFormData.date}
            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Topic</label>
          <input
            type="text"
            className="form-control"
            value={editFormData.topic}
            onChange={(e) => setEditFormData({ ...editFormData, topic: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Period</label>
          <input
            type="number"
            className="form-control"
            value={editFormData.period_number}
            onChange={(e) => setEditFormData({ ...editFormData, period_number: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Hours</label>
          <input
            type="number"
            className="form-control"
            value={editFormData.hour_count}
            onChange={(e) => setEditFormData({ ...editFormData, hour_count: e.target.value })}
            required
          />
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Edit Modal */}
     {/* {showEditModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title">Edit Attendance</h5>
                <button 
                  type="button" 
                  className="btn-close btn-danger " 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="mb-2">
                    <label className="text-info">Date</label>
                    <input 
                      type="date" 
                      className="form-control border-secondary"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-info">Topic</label>
                    <input 
                      type="text" 
                      className="form-control border-secondary"
                      value={editFormData.topic}
                      onChange={(e) => setEditFormData({...editFormData, topic: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-info">Period</label>
                    <input 
                      type="number" 
                      className="form-control border-secondary"
                      value={editFormData.period_number}
                      onChange={(e) => setEditFormData({...editFormData, period_number: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-info">Hours</label>
                    <input 
                      type="number" 
                      className="form-control border-secondary"
                      value={editFormData.hour_count}
                      onChange={(e) => setEditFormData({...editFormData, hour_count: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*Add Model
      {showAddModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header border-bottom border-secondary">
                <h5 className="modal-title">Add Attendance</h5>
                <button 
                  type="button" 
                  className="btn-close btn-danger" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAttendance}>
                  <div className="mb-2">
                    <label className="text-info">Date</label>
                    <input 
                      type="date" 
                      className="form-control border-secondary"
                      value={addFormData.date}
                      onChange={(e) => setAddFormData({...addFormData, date: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-info">Topic</label>
                    <input 
                      type="text" 
                      className="form-control border-secondary"
                      value={addFormData.topic}
                      onChange={(e) => setAddFormData({...addFormData, topic: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-info">Period</label>
                    <input 
                      type="number" 
                      className="form-control border-secondary"
                      value={addFormData.period_number}
                      onChange={(e) => setAddFormData({...addFormData, period_number: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-info">Hours</label>
                    <input 
                      type="number" 
                      className="form-control border-secondary"
                      value={addFormData.hour_count}
                      onChange={(e) => setAddFormData({...addFormData, hour_count: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}*/}
      {showAddModal && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 999
  }}>
    <div style={{
      backgroundColor: 'white', padding: 20,
      borderRadius: 8, width: '400px'
    }}>
      <h3>Add Attendance</h3>
      <form onSubmit={handleAttendance} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={addFormData.date}
            onChange={(e) => setAddFormData({ ...addFormData, date: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Topic</label>
          <input
            type="text"
            className="form-control"
            value={addFormData.topic}
            onChange={(e) => setAddFormData({ ...addFormData, topic: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Period</label>
          <input
            type="number"
            className="form-control"
            value={addFormData.period_number}
            onChange={(e) => setAddFormData({ ...addFormData, period_number: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hours</label>
          <input
            type="number"
            className="form-control"
            value={addFormData.hour_count}
            onChange={(e) => setAddFormData({ ...addFormData, hour_count: e.target.value })}
            required
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
};

export default Attendance; 