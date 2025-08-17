import React from 'react';

const SubjectTable = ({ subjects, editSubject, deleteSubject, openAttendanceForm }) => {
  if (!subjects || !subjects.length) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderLeft: '4px solid #0ef',
      padding: '1.5rem',
      borderRadius: '8px',
      margin: '1rem'
    }}>
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead className="bg-gray-100" style={{ border: '1px solid transparent' }}>
            <tr className='border-b border-white'>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Subject ID</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Subject Name</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Subject Type</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Class Name</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Type</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Semester</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Semester Type</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Department</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Regulation</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Remaining Hours</th>
              <th className=" px-4 py-2" style={{ border: '1px solid transparent' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.subject_id} className='border-b border-white'>
                <td className=" px-4 py-2"style={{ border: '1px solid transparent' }} >{subject.subject_id}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.subject_name}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.subject_type}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.class_name}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.type}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.semester}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.semester_type}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.department}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.regulation}</td>
                <td className=" px-4 py-2" style={{ border: '1px solid transparent' }}>{subject.remaining_hours}</td>
                <td className=" px-4 py-2 flex gap-2" style={{ border: '1px solid transparent' }}>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => editSubject(subject)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => deleteSubject(subject)}
                  >
                    🗑️
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => openAttendanceForm(subject)}
                  >
                    ✅
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectTable;
