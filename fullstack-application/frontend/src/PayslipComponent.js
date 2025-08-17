import React from "react";
import {useLocation} from 'react-router-dom';
import jsPDF from 'jspdf';

function PayslipComponent(){
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const location = useLocation();
  const { subjectId, month, year } = location.state || {};
  // Fetch data from backend
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        
        if ( !subjectId || !month || !year) {
          setError("Missing required parameters");
          
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5870/api/payslip`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject_id : subjectId,
            month : month,
            year : year
          })
        });
        
        if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const jsonData = await response.json();
       
        // Process the data to match the required structure
        const processedData = {
          staff_id: jsonData.staff_id,
          staff_name: jsonData.staff_name,
          department: jsonData.department,
          semester: jsonData.semester,
          semester_type: jsonData.semester_type,
          type:jsonData.type,
          month: month,
          year: year,
          subjects: [{
            name: jsonData.subject_name,
            code: jsonData.subject_code,
            department: jsonData.department,
            semester: jsonData.semester,
            subject_type: jsonData.subject_type,
            topics: jsonData.attendance_records.map(record => ({
              date: record.date,
              period: record.period_number,
              hours: record.hour_count,
              topic: record.topic,
              pay: record.hour_count * (jsonData.subject_type === 'theory' ? 600 : 360)
            })),
            total_hours: jsonData.total_hours,
            claimed_hours: jsonData.already_claimed,
            claiming_hours: jsonData.attendance_records.reduce((sum, record) => 
              sum + (record.hour_count * 1), 0
            ),
            balance_hours: jsonData.balance,
            total_pay: jsonData.attendance_records.reduce((sum, record) => 
              sum + (record.hour_count * (jsonData.subject_type === 'theory' ? 600 : 360)), 0
            )
          }],
          total_pay: jsonData.attendance_records.reduce((sum, record) => 
            sum + (record.hour_count * (jsonData.subject_type === 'theory' ? 600 : 360)), 0
          )
        };
        
        setData(processedData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payslip data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ subjectId, month, year]);

  const downloadSubjectPDF = (subject = 'all') => {

    const doc = new jsPDF();
    let content;
    
    if (subject === 'all') {
      content = document.getElementById("main").cloneNode(true);
      // Remove the download button from the clone
      const downloadBtn = content.querySelector('.download-btn');
      if (downloadBtn) {
        downloadBtn.remove();
      }
    } else {
      // Create a temporary container for the subject-specific PDF
      const tempContainer = document.createElement('div');
      tempContainer.style.display = 'none';
      document.body.appendChild(tempContainer);

      // Clone the main container
      const mainClone = document.getElementById("main").cloneNode(true);
      
      // Remove all subject sections except the selected one
      const subjectSections = mainClone.querySelectorAll('.subject-section');
      subjectSections.forEach(section => {
        if (section.id !== `subject-${subject}`) {
          section.remove();
        }
      });

      // Remove the download button from the clone
      const downloadBtn = mainClone.querySelector('.download-btn');
      if (downloadBtn) {
        downloadBtn.remove();
      }

      // Update the total pay to show only the selected subject's pay
      const totalPayElement = mainClone.querySelector('#totalPay');
      if (totalPayElement) {
        const subjectData = data.subjects.find(s => s.name === subject);
        if (subjectData) {
          totalPayElement.textContent = subjectData.total_pay;
        }
      }

      tempContainer.appendChild(mainClone);
      content = mainClone;
    }

    if (!content) {
      alert("Content not found");
      return;
    }

    doc.html(content, {
      callback: function(doc) {
        if (subject !== 'all') {
          // Remove the temporary container
          content.parentNode.remove();
        }
        doc.save(subject === 'all' ? 'complete-payslip.pdf' : `${subject}-payslip.pdf`);
      },
      margin: [10, 10, 10, 10],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 190,
      windowWidth: 800
    });
  };

  const renderStaffDetails = () => {
    const mon = ['January','February','March','April','May','June','July','August','September','October','November','December']
    return React.createElement(
      "div",
      { id: "staffDetails" },        
      React.createElement('h6',null,'Personal Data:'),
      React.createElement("p", null, React.createElement("strong", null, "Name of the staff : "), data.staff_name),
      React.createElement("p", null, React.createElement("strong", null, "Staff ID          : "), data.staff_id),
      React.createElement("p", null, React.createElement("strong", null, "Department        : "), data.department),
      React.createElement("p", null, React.createElement("strong", null, "Month/year        : "), `${mon[Number(data.month - 1 )]}/${data.year}`),
      React.createElement("p", null, React.createElement("strong", null, "Semester          : "), data.semester_type)
    );
  };

  /*const renderSubjectSection = (subject) => {
    const cappedTotalPay = Math.min(subject.total_pay, 19990);
    
    return React.createElement(
      "div",
      { 
        id: `subject-${subjects.name}`,
        key: `subject-${subjects.name}`,
        className: "subject-section" 
      },
      React.createElement(
        "div",
        { className: "subject-info", key: `info-${subjects.name}` },
        React.createElement(
          "div",
          { className: "subject-details", key: `details-${subjects.name}` },
          React.createElement("p", { key: `code-${subjects.name}` }, 
            React.createElement("strong", null, "Subject Code: "), 
            subject.code
          ),
          React.createElement("p", { key: `name-${subjects.name}` }, 
            React.createElement("strong", null, "Subject Name: "), 
            subject.name
          ),
          React.createElement("p", { key: `dept-${subjects.name}` }, 
            React.createElement("strong", null, "Department: "), 
            subject.department
          ),
          React.createElement("p", { key: `sem-${subjects.name}` }, 
            React.createElement("strong", null, "Semester: "), 
            subject.semester
          ),
          React.createElement("p", { key: `sem-type-${subjects.name}` }, 
            React.createElement("strong", null, "Semester Type: "), 
            subject.semester_type
          )
        ),
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", null, "Sl.No"),
              React.createElement("th", null, "Date"),
              React.createElement("th", null, "Time"),
              React.createElement("th", null, `${subjects.type} Topics Covered`),
              React.createElement("th", null, "Hours"),
              React.createElement("th", null, "Pay (₹360/hour)")
            )
          ),
          React.createElement(
            "tbody",
            null,
            Array.from({ length: 20 }, (_, index) => {
              const topic = subjects.subject[index];
              return React.createElement(
                "tr",
                { key: index },
                React.createElement("td", null, index + 1),
                React.createElement("td", null, topic ? topic.date : ""),
                React.createElement("td", null, topic ? topic.time : ""),
                React.createElement("td", null, topic ? topic.topic : ""),
                React.createElement("td", null, topic ? topic.hours : ""),
                React.createElement("td", null, topic ? "₹" + topic.pay : "")
              );
            })
          )
        ),
        React.createElement(
          "div",
          { className: "hours-summary" },
          React.createElement("p", null, 
            React.createElement("strong", null, "Allotted Hours for the Subject: "), 
            subject.total_hours
          ),
          React.createElement("p", null, 
            React.createElement("strong", null, "Already claimed hours for the Subject: "), 
            subject.claimed_hours
          ),
          React.createElement("p", null, 
            React.createElement("strong", null, "Claiming Hours for this month: "), 
            subject.claiming_hours
          ),
          React.createElement("p", null, 
            React.createElement("strong", null, "Balance hours: "), 
            subject.balance_hours
          )
        ),
        React.createElement(
          "p",
          { className: "subject-total" },
          React.createElement("strong", null, "Total Hours: "),
          subject.total_hours,
          React.createElement("strong", { style: { marginLeft: "20px" } }, "Total Pay: "),
          "₹",
          cappedTotalPay
        )
      )
    );
  }; */
  const renderSubjectSection = (subject) => {
    const cappedTotalPay = Math.min(subject.total_pay, 19990);
  
    return React.createElement(
      "div",
      {
        id: `subject-${subject.name}`,
        key: subject.name,
        className: "subject-section"
      },
      React.createElement('p',null,'Class Handled:'),
      React.createElement(
        "div",
        { className: "subject-info" },
        React.createElement(
          "div",
          { className: "subject-details" },
          React.createElement("p", null,
            React.createElement("strong", null, "Subject Coe: "),
            subject.code
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Subject Name: "),
            subject.name
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Department: "),
            subject.department
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Semester: "),
            subject.semester
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Semester Type: "),
            subject.semester_type
          )
        ),
        React.createElement(
          "table",
          null,
          React.createElement(
            "thead",
            null,
            React.createElement(
              "tr",
              null,
              React.createElement("th", null, "Sl.No"),
              React.createElement("th", null, "Date"),
              React.createElement("th", null, "Time"),
              React.createElement("th", null, `${subject.type} Topics Covered`),
              React.createElement("th", null, "Hours"),
              React.createElement("th", null, `Pay (${(subjects.subject_type==="theory")?"600":"360"}/hour)`)
            )
          ),
          React.createElement(
            "tbody",
            null,
            Array.from({ length: 20 }, (_, index) => {
              const topic = subject.topics[index]; // make sure it's 'topics'
              return React.createElement(
                "tr",
                { key: index },
                React.createElement("td", null, index + 1),
                React.createElement("td", null, topic ? topic.date : ""),
                React.createElement("td", null, topic ? topic.time : ""),
                React.createElement("td", null, topic ? topic.topic : ""),
                React.createElement("td", null, topic ? topic.hours : ""),
                React.createElement("td", null, topic ? "₹" + topic.pay : "")
              );
            })
          )
        ),
  
        React.createElement(
          "div",
          { className: "hours-summary" },
          React.createElement('br',null,null),
          React.createElement("p", null,
            React.createElement("strong", null, "Allotted Hours for the Subject: "),
            subject.total_hours
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Already claimed hours for the Subject: "),
            subject.claimed_hours
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Claiming Hours for this month: "),
            subject.claiming_hours
          ),
          React.createElement("p", null,
            React.createElement("strong", null, "Balance hours: "),
            subject.total_hours - subject.claiming_hours - subject.claimed_hours
          )
        ),
  
        React.createElement(
          "p",
          { className: "subject-total" },
          React.createElement("strong", null, "Total Hours: "),
          subject.total_hours,
          React.createElement("strong", { style: { marginLeft: "20px" } }, "Total Pay: "),
          "₹",
          cappedTotalPay
        )
      )
    );
  };
  
  function numberToWords(num) {
    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
  
    if (num === 0) return 'Zero Rupees Only';
    if (num > 19990) return 'Amount exceeds limit';
  
    let words = '';
  
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      words += ones[thousands] + ' Thousand ';
      num = num % 1000;
    }
    if (num >= 100) {
      const hundreds = Math.floor(num / 100);
      words += ones[hundreds] + ' Hundred ';
      num = num % 100;
    }
    if (num > 0) {
      if (words !== '') words += 'and ';
      if (num < 20) {
        words += ones[num];
      } else {
        words += tens[Math.floor(num / 10)];
        if (num % 10) words += ' ' + ones[num % 10];
      }
    }
    return words.trim() + ' Rupees Only';
  }
  function formatDate(dateString) {
    if (!dateString) return '';
    // If the string contains 'T', split and take only the date part
    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}-${month}-${year}`;
  }
  const renderSubjectList = () => {
    const subjectCount = data.subjects.length;
    const baseSpacing = 5; // Base spacing in pixels
    const maxSpacing = 20; // Maximum spacing in pixels
    const minSpacing = 2; // Minimum spacing in pixels
    
    // Calculate dynamic spacing based on number of subjects
    const spacing = Math.max(
      minSpacing,
      Math.min(maxSpacing, (297 - 15 * 2 - 100) / subjectCount) // 297mm page height - margins - header/footer space
    );

    return data.subjects.map(subject => {
      return React.createElement(
        "div",
        { 
          id: `subject-${subject.name}`,
          key: subject.name,
          className: "subject-section",
          style: { margin: `${spacing}px 0` }
        },
        React.createElement(
          "div",
          { className: "subject-info" },
          React.createElement('h6',null,'Class Handled:'),
          React.createElement(
            "div",
            { className: "subject-details" },
            React.createElement("p", null, 
              React.createElement("strong", null, "Subject Code And Name : "), 
              `${subject.code} ${subject.name}`
            ),
            React.createElement("p", null, 
              React.createElement("strong", null, "Department Of Student: "), 
              subject.department
            ),
            React.createElement("p", null, 
              React.createElement("strong", null, "Semester: "), 
              subject.semester
            )
          ),
          React.createElement(
            "table",
            null,
            React.createElement(
              "thead",
              null,
              React.createElement(
                "tr",
                null,
                React.createElement("th", {style:{textAlign : "center" }}, "Sl.No"),
                React.createElement("th", {style:{textAlign : "center" }}, "Date"),
                React.createElement("th", {style:{textAlign : "center" }}, "Period"),
                React.createElement("th", {style:{textAlign : "center" }}, `${(subject.subject_type=='lab')?'Lab':'Theory'} Topics Covered`),
                React.createElement("th", {style:{textAlign : "center" }}, "Hours Handled"),
                React.createElement("th",{style:{textAlign : "center" }}, `Amount (₹${(subject.subject_type==="theory")?"600":"360"}/hour)`)
              )
            ),
            React.createElement(
              "tbody",
              null,
              // Create 20 rows, filling with data where available
              Array.from({ length: 20 }, (_, index) => {
                const topic = subject.topics[index];
                return React.createElement(
                  "tr",
                  { key: index },
                  React.createElement("td", {style:{textAlign : "center" }}, index + 1),
                  React.createElement("td", {style:{textAlign : "center" }}, topic ? formatDate(topic.date) : ""),
                  React.createElement("td", {style:{textAlign : "center" }}, topic ? topic.period: ""),
                  React.createElement("td", {style:{textAlign : "center" }}, topic ? topic.topic : ""),
                  React.createElement("td", {style:{textAlign : "center" }}, topic ? topic.hours : ""),
                  React.createElement("td", {style:{textAlign : "right" }}, topic ?  topic.pay : "")
                );
              })
            )
          ),
          React.createElement(
            "div",
            { className: "hours-summary" },
            React.createElement(
              "div",
              { className: "total-pay" },
              React.createElement("strong", null, "Total Pay:"),
              React.createElement("span",null, ` ₹${data.total_pay}`),
              React.createElement("strong",null,`(${numberToWords(data.total_pay)})`)
            ),
            React.createElement('br',null,null),
            React.createElement("p", null, 
              React.createElement("strong", null, "Allotted Hours for the Subject: "), 
              subject.total_hours
            ),
            React.createElement("p", null, 
              React.createElement("strong", null, "Already claimed hours for the Subject: "), 
              subject.claimed_hours
            ),
            React.createElement("p", null, 
              React.createElement("strong", null, "Claiming Hours for this month: "), 
              subject.claiming_hours
            ),
            React.createElement("p", null, 
              React.createElement("strong", null, "Balance hours: "), 
              subject.total_hours - subject.claiming_hours - subject.claimed_hours
            )
          ),
      /*    React.createElement(
            "p",
            { className: "subject-total" },
            React.createElement("strong", null, "Total Hours: "),
            subject.total_hours,
            React.createElement("strong", { style: { marginLeft: "20px" } }, "Total Pay: "),
            "₹",
            subject.total_pay
          )*/
        )
      );
    });
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement("style", null, `
      :root {
        --primary-color: #2c3e50;
        --border-color: #ddd;
        --text-color: #333;
        --background-color: #fff;
        --header-bg: #f8f9fa;
      }
      body { 
        font-family: Arial, sans-serif; 
        margin: 0; 
        padding: 0; 
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        background-color: #f5f5f5; 
        color: var(--text-color); 
        line-height: 1.1; 
        font-size: 9pt;
      }
      #main { 
        background: var(--background-color); 
        width: 210mm; 
        min-height: 297mm; 
        padding: 10mm; 
        margin: 0 auto; 
        border: 1px solid var(--border-color); 
        border-radius: 5px; 
        box-shadow: 0 0 10px rgba(0,0,0,0.1); 
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .header { 
        text-align: center; 
        margin-bottom: 2px; 
        padding-bottom: 2px; 
        border-bottom: 2px solid var(--border-color); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        gap: 5px; 
        flex-shrink: 0;
      }
      .header img { 
        width: 40px; 
        height: 40px; 
        margin: 0; 
      }
      .header h2 { 
        color: var(--primary-color); 
        margin: 0; 
        font-size: 12pt; 
      }
      .header h4 { 
        margin: 0; 
        color: var(--text-color); 
        font-size: 9pt; 
      }
      #payslipContainer { 
        padding: 2px; 
        border: 1px solid var(--border-color); 
        border-radius: 5px; 
        margin: 2px 0; 
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      #staffDetails { 
        background-color: var(--header-bg); 
        padding: 2px; 
        border-radius: 5px; 
        margin-bottom: 2px; 
        flex-shrink: 0;
      }
      #staffDetails p {
        margin: 1px 0;
      }
      .subject-section { 
        margin: 0; 
        padding: 2px; 
        border: 1px solid var(--border-color); 
        border-radius: 5px; 
        flex-shrink: 0;
      }
      .subject-info { 
        margin-bottom: 2px; 
      }
      .subject-info h3 { 
        margin: 0 0 1px 0; 
        color: var(--primary-color); 
        font-size: 10pt;
        text-align: center;
      }
      .subject-details {
        margin-bottom: 2px;
      }
      .subject-details p {
        margin: 1px 0;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 2px 0; 
        font-size: 9pt; 
      }
      th, td { 
        padding: 1px; 
        text-align: left; 
        border: 1px solid var(--border-color); 
        vertical-align: middle; 
      }
      .hours-summary {
        margin: 2px 0;
        padding: 2px;
        background-color: var(--header-bg);
        border-radius: 5px;
      }
      .hours-summary p {
        margin: 1px 0;
      }
      .total-pay { 
        background-color: var(--header-bg); 
        padding: 2px; 
        border-radius: 5px; 
        margin-top: 2px; 
        font-size: 9pt; 
        flex-shrink: 0;
      }
      .signatures { 
        margin-top: 40px; 
        display: flex; 
        justify-content: space-around; 
        padding: 20px 0 0 0; 
        flex-shrink: 0;
      }
      .signatures p { 
        text-align: center; 
        font-weight: bold; 
        font-size: 9pt; 
        position: relative; 
        padding-top: 10px; 
      }
      .signatures p::before { 
        content: ''; 
        position: absolute; 
        top: 0; 
        left: 50%; 
        transform: translateX(-50%); 
        width: 60px; 
        height: 1px; 
        background-color: var(--border-color); 
      }
      .pto { 
        text-align: right; 
        margin-top: 2px; 
        font-size: 9pt; 
        color: var(--text-color); 
      }
      .download-btn { 
        padding: 4px 8px; 
        background-color: var(--primary-color); 
        color: white; 
        border: none; 
        border-radius: 5px; 
        cursor: pointer; 
        font-size: 9pt; 
        transition: background-color 0.3s ease; 
      }
      .download-btn:hover { 
        background-color: #34495e; 
      }
      @media print { 
        body { 
          padding: 0; 
          background: none; 
        } 
        #main { 
          width: 100%; 
          min-height: auto; 
          padding: 0; 
          margin: 0; 
          border: none; 
          box-shadow: none; 
        } 
        .download-btn { 
          display: none; 
        } 
      }
    `),
    loading ? React.createElement("div", null, "Loading...") :
    error ? React.createElement("div", null, `Error: ${error}`) :
    !data ? React.createElement("div", null, "No data available") :
    React.createElement(
      "div",
      { id: "main" },
      React.createElement(
        "div",
        { className: "header" },
        React.createElement("img", { src: "/ucen.png", alt: "Logo" ,  style: { height: '80px', width:'80px' } }),
        React.createElement(
          "div",
          { className: "header-text" },
          React.createElement("h2", null, "UNIVERSITY COLLEGE OF ENGINEERING, NAGERCOIL"),
          React.createElement("h2", null, "(A CONSTITUENT COLLEGE OF ANNA UNIVERSITY CHENNAI)"),
          React.createElement("h2", null, "NAGERCOIL – 629 004")
        )
      ),
      React.createElement("h5", { style: { textAlign: "center", margin: "20px 0",fontSize:"15px" } }, "CLAIM FOR REMUNERATION FOR HOURLY BASIS TEACHING STAFF MEMBERS FOR B.E/B.TECH PROGRAMME"),
      React.createElement(
        "div",
        { id: "payslipContainer" },
        renderStaffDetails(),
       
        React.createElement("div", { id: "subjectList" }, renderSubjectList()),
        
      ),
      
      React.createElement(
        "div",
        { className: "signatures" },
        
        React.createElement("p", null, "Signature of the Staff"),
        React.createElement("p", null, "Signature of the HOD"),
        React.createElement("p", null, "DEAN")
      ),
      React.createElement("div", { className: "pto" }, "P.T.O")
    ),
    React.createElement(
      "button",
      {
        className: "download-btn",
        style: { marginTop: "20px" },
        onClick: () => downloadSubjectPDF('all')
      },
      "Download Complete Payslip"
    )
  );
};

export default PayslipComponent;