import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ useNavigate, not Navigate
import 'bootstrap/dist/css/bootstrap.min.css';


const AddSubjectForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    subject_type: '',
    semester: '',
    total_hours: '',
    department: '',
    class_name: '',
    regulation: '',
    period: '',
    type: ''
  });

  const getYearFromSemester = (sem) => {
    const semInt = parseInt(sem);
    if (semInt <= 2) return 1;
    if (semInt <= 4) return 2;
    if (semInt <= 6) return 3;
    if (semInt <= 8) return 4;
    return '';
  };
  const handleCancel = () => {
    navigate('/dashboard');
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      semester: parseInt(formData.semester),
      total_hours: parseInt(formData.total_hours),
      remaining_hours: parseInt(formData.total_hours), // Auto-calculated
      year_no: getYearFromSemester(formData.semester),
      semester_type: (formData.semester % 2 === 0) ? 'even' : 'odd' // Auto-calculated
    };

    try {
      const res = await fetch('http://localhost:5870/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submissionData),
      });

      if (!res.ok) throw new Error('Submission failed');

      alert('Subject added successfully!');
      navigate('/dashboard'); // ✅ Correct way to navigate
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  return (
<>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          .form-container {
            background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
            min-height: 100vh;
            padding: 2rem 0;
          }

          .form-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
            transition: all 0.3s ease;
          }

          .form-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.47);
          }

          .card-header {
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            color: white;
            border-radius: 20px 20px 0 0 !important;
            padding: 1.5rem;
            text-align: center;
          }

          .form-label {
            color: #2c3e50;
            font-weight: 600;
            margin-bottom: 0.5rem;
            transition: all 0.3s ease;
          }

          .form-control {
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            padding: 0.8rem 1rem;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
          }

          .form-control:focus {
            border-color: #6a11cb;
            box-shadow: 0 0 0 0.2rem rgba(106, 17, 203, 0.25);
            transform: translateY(-2px);
          }

          .form-control::placeholder {
            color: #95a5a6;
          }

          .btn-submit {
            background: linear-gradient(45deg, #6a11cb, #2575fc);
            border: none;
            border-radius: 10px;
            padding: 0.8rem 2rem;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .btn-submit:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(106, 17, 203, 0.4);
          }

          .btn-submit:active {
            transform: translateY(-1px);
          }

          .btn-submit::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transform: translateX(-100%);
            transition: 0.5s;
          }

          .btn-submit:hover::after {
            transform: translateX(100%);
          }

          .floating-icon {
            position: absolute;
            animation: float 3s ease-in-out infinite;
          }

          .pulse-animation {
            animation: pulse 2s infinite;
          }

          .form-group {
            position: relative;
            margin-bottom: 1.5rem;
          }

          .form-group i {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #6a11cb;
          }
        `}
      </style>

      <div className="form-container">
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="form-card">
                <div className="card-header">
                  <h3 className="text-center mb-0 pulse-animation">
                    <i className="bi bi-book-fill me-2"></i>
                    Add New Subject
                  </h3>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Subject Code</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="subject_code" 
                            placeholder="e.g. CS6301" 
                            value={formData.subject_code} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-hash"></i>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Subject Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="subject_name" 
                            placeholder="e.g. Data Structures" 
                            value={formData.subject_name} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-book"></i>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Subject Type</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="subject_type" 
                            placeholder="e.g. Theory/Lab" 
                            value={formData.subject_type} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-type"></i>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Semester</label>
                          <input 
                            type="number" 
                            className="form-control"
                            name="semester" 
                            placeholder="e.g. 5" 
                            value={formData.semester} 
                            onChange={handleChange} 
                            min="1"
                            max="8"
                            required
                          />
                          <i className="bi bi-123"></i>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Total Hours</label>
                          <input 
                            type="number" 
                            className="form-control"
                            name="total_hours" 
                            placeholder="e.g. 60" 
                            value={formData.total_hours} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-clock"></i>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Department</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="department" 
                            placeholder="e.g. Computer Science" 
                            value={formData.department} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-building"></i>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Class Name</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="class_name" 
                            placeholder="e.g. CSE A" 
                            value={formData.class_name} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-people"></i>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Regulation</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="regulation" 
                            placeholder="e.g. 2021" 
                            value={formData.regulation} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-journal-text"></i>
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Period</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="period" 
                            placeholder="e.g. 2022-23" 
                            value={formData.period} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-calendar"></i>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Type</label>
                          <input 
                            type="text" 
                            className="form-control"
                            name="type" 
                            placeholder="e.g. Core/Elective" 
                            value={formData.type} 
                            onChange={handleChange} 
                            required
                          />
                          <i className="bi bi-tag"></i>
                        </div>
                      </div>
                    </div>

                    <div className="d-grid gap-2 mt-4">
                      <button type="submit" className="btn btn-submit">
                        <i className="bi bi-plus-circle me-2"></i>
                        Submit Subject
                      </button>
                      <button type="button" onClick={()=> navigate('/dashboard')} className='btn-secondary'>
                        cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddSubjectForm;