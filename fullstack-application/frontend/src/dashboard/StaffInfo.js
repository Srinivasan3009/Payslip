import React from 'react';

const StaffInfo = ({ staff }) => {
  if (!staff) return null;

  return (
    <div style={{ marginTop: '20px' }}>
      <p><strong>NAME:</strong> {staff.name}</p>
      <p><strong>EMAIL:</strong> {staff.email}</p>
      <p><strong>DEPARTMENT:</strong> {staff.department}</p>
    </div>
  );
};

export default StaffInfo;
