import React, { useState, useEffect } from 'react';

export default function Tools() {
  const [tables, setTables] = useState([]);
  const [newTableCapacity, setNewTableCapacity] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tables');
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      const data = await response.json();

      // For each table, fetch the QR code from the server
      const tablesWithQRCodes = await Promise.all(
        data.map(async (table) => {
          const qrResponse = await fetch(`/api/tables/${table.tableId}/qrcode`);
          const qrData = await qrResponse.json();
          return { ...table, qrCodeImage: qrData.qrCodeImage };
        })
      );

      setTables(tablesWithQRCodes);
      setError(null);
    } catch (error) {
      setError('Error fetching tables or QR codes.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... (existing handleCreateTable and handleDeleteTable functions) ...
  const handleCreateTable = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity: newTableCapacity })
      });

      if (!response.ok) {
        throw new Error('Failed to create table');
      }
      setNewTableCapacity(2);
      fetchTables(); // Refresh the list of tables
    } catch (error) {
      setError('Error creating table.');
      console.error('Error creating table:', error);
    }
  };

  const handleDeleteTable = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        const response = await fetch(`/api/tables/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete table');
        }
        fetchTables(); // Refresh the list of tables
      } catch (error) {
        setError('Error deleting table.');
        console.error('Error deleting table:', error);
      }
    }
  };

  const handleDownloadQR = (tableId, qrCodeImage) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeImage;
    downloadLink.download = `${tableId}-qrcode.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };


  return (
    <div className="tools-container">
      <h2>Table Management</h2>
      <div className="create-table-form">
        <h3>Create New Table</h3>
        <form onSubmit={handleCreateTable}>
          <label htmlFor="capacity">Table Capacity:</label>
          <input
            type="number"
            id="capacity"
            value={newTableCapacity}
            onChange={(e) => setNewTableCapacity(e.target.value)}
            min="1"
            required
          />
          <button type="submit">Add Table</button>
        </form>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading tables...</p>
      ) : (
        <div className="tables-list">
          <h3>Existing Tables</h3>
          {tables.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Table ID</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>QR Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table._id}>
                    <td>{table.tableId}</td>
                    <td>{table.capacity}</td>
                    <td>{table.status}</td>
                    <td>
                      <div className="qr-code-wrapper">
                        {table.qrCodeImage && (
                          <img src={table.qrCodeImage} alt={`QR Code for ${table.tableId}`} />
                        )}
                        <button onClick={() => handleDownloadQR(table.tableId, table.qrCodeImage)}>Download QR</button>
                      </div>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteTable(table._id)} className="delete-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tables found. Add a new one to get started.</p>
          )}
        </div>
      )}
    </div>
  );
}