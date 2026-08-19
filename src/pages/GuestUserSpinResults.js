import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import './GuestUserSpinResults.scss';

const sanitizeFilename = (name) => (name || '').trim().replace(/[^a-z0-9-_ ]/gi, '').trim();

const GuestUserSpinResults = ({ setViewResults, wheel }) => {
  const [guestResults, setGuestResults] = useState([]);
  const wheelName = wheel.name || 'Untitled Wheel';

  useEffect(() => {
    const storedGuestResults = JSON.parse(sessionStorage.getItem(`wheel_${wheel.id}_guestResults`)) || [];
    setGuestResults(storedGuestResults);
  }, [wheel.id]);

  const handleCloseModal = () => {
    setViewResults(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor('#3183ff');
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `${wheelName} - Your Spin Results (${guestResults.length})`;
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 10);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const headerHeight = 10;
    const rowHeight = 10;
    const tableWidth = pageWidth - 2 * margin;
    const columnWidths = [20, 40, 40, 40, 40];
    const columnHeaders = ['Index', 'Username', 'Winner', 'Date', 'Time'];
  
    let y = 30;
    const addResultsPage = () => {
      doc.addPage();
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor('#3183ff');
      doc.text(title, titleX, 10);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      y = 30;
    };
  
    const drawTableHeader = () => {
      doc.setFont('Helvetica', 'bold');
      doc.setFillColor('#3183ff');
      doc.rect(margin, y - headerHeight, tableWidth, headerHeight, 'F');
      doc.setTextColor(255, 255, 255);
      let x = margin;
      columnHeaders.forEach((header, index) => {
        doc.text(header, x + columnWidths[index] / 2, y - 2, { align: 'center' });
        x += columnWidths[index];
      });
      doc.setTextColor(0, 0, 0);
      y += headerHeight;
    };
  
    const drawTableRow = (index, result) => {
      doc.setFont('Helvetica', 'normal');
      let x = margin;
      const rowData = [
        index + 1,
        result.username,
        result.winner,
        new Date(result.date).toLocaleDateString(),
        new Date(result.date).toLocaleTimeString()
      ];
      rowData.forEach((data, columnIndex) => {
        doc.text(data.toString(), x + columnWidths[columnIndex] / 2, y, { align: 'center' });
        x += columnWidths[columnIndex];
      });
      y += rowHeight;
    };
  
    drawTableHeader();
  
    if (guestResults.length > 0) {
      guestResults.forEach((result, index) => {
        if (y + rowHeight > pageHeight) {
          addResultsPage();
          drawTableHeader();
        }
  
        drawTableRow(index, result);
      });
    } else {
      doc.text('No results yet. Spin to start!', margin, y);
    }
  
    doc.save(`${sanitizeFilename(wheelName) || 'spin-results'}.pdf`);
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      guestResults.map((result, index) => ({
        Index: index + 1,
        Username: result.username,
        Winner: result.winner,
        Date: new Date(result.date).toLocaleDateString(),
        Time: new Date(result.date).toLocaleTimeString()
      }))
    );
  
    const wb = XLSX.utils.book_new();
    const sheetName = sanitizeFilename(wheelName).substring(0, 31) || 'Spin Results';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    XLSX.writeFile(wb, `${sanitizeFilename(wheelName) || 'spin-results'}.xlsx`);
  };
  
  return (
    <div className="modal-container" onClick={handleCloseModal}>
      <div className="guest-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="hdr">
            <h2>{wheelName}</h2>
          </div>
          <div className="txt">
            <p>Your spin results over time: (<span>{guestResults.length}</span>)</p>
          </div>
          {guestResults.length > 0 && (
            <div className="spin-results-list">
              <ul>
                {guestResults.map((result, index) => (
                  <li key={index}>
                    <p><strong>Username:</strong> {result.username}</p>
                    <p><strong>Winner:</strong> {result.winner}</p>
                    <p><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(result.date).toLocaleTimeString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {guestResults.length === 0 && <p>No results yet. Spin to start!</p>}
          <div className="to-do">
            <div className="close">
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="download">
              <button className="btn" onClick={handleDownloadPDF}>Download PDF</button>
              <button onClick={handleDownloadExcel}>Download Excel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestUserSpinResults
