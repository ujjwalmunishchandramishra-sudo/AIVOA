import { useState } from "react";

function App() {
  const [complaintText, setComplaintText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fileName, setFileName] = useState("");
  const [committed, setCommitted] = useState(false);

  const [showLedger, setShowLedger] = useState(false);
  const [ledger, setLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  // ================================
  // ANALYZE TEXT COMPLAINT
  // ================================

  const analyzeComplaint = async () => {
    if (!complaintText.trim()) {
      alert("Please enter a complaint first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setCommitted(false);

    try {
      const response = await fetch("/api/analyze-complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          complaint_text: complaintText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Complaint analysis failed");
      }

      setResult(data.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the FastAPI backend.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // ANALYZE PDF
  // ================================

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setResult(null);
    setCommitted(false);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "PDF analysis failed");
      }

      setComplaintText(data.extracted_text || "");
      setResult(data.data);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Could not analyze the PDF.");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // SUGGESTED ACTION
  // ================================

  const getSuggestedAction = () => {
    if (!result) {
      return "";
    }

    const risk = result.risk_level?.toLowerCase();

    if (risk === "high" || risk === "critical") {
      return "Immediately escalate to QA investigation and place the affected batch on hold.";
    }

    if (risk === "medium") {
      return "Route to QA investigation and review the affected batch and materials.";
    }

    return "Route to QA investigation and review the affected units.";
  };

  // ================================
  // COMMIT TO QMS
  // ================================

  const commitToQMS = async () => {
    if (!result) {
      alert("Please analyze a complaint first.");
      return;
    }

    try {
      const response = await fetch("/api/commit-qms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: result.product_name,
          batch_number: result.batch_number,
          originating_site: result.originating_site,
          impacted_materials: result.impacted_materials,
          defect_summary: result.defect_summary,
          risk_level: result.risk_level,
          risk_reason: result.risk_reason,
          complaint_text: complaintText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "QMS commit failed");
      }

      setCommitted(true);

      alert("Complaint successfully committed to QMS Ledger.");
    } catch (error) {
      console.error("QMS Error:", error);
      alert("Could not commit complaint to QMS Ledger.");
    }
  };

  // ================================
  // LOAD QMS LEDGER
  // ================================

  const loadLedger = async () => {
    setLedgerLoading(true);

    try {
      const response = await fetch("/api/qms-ledger");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not load QMS Ledger");
      }

      setLedger(data.data || []);
      setShowLedger(true);
    } catch (error) {
      console.error("Ledger Error:", error);
      alert("Could not load QMS Ledger.");
    } finally {
      setLedgerLoading(false);
    }
  };

  // ================================
  // STYLES
  // ================================

  const tableHeader = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    background: "#f5f5f5",
  };

  const tableCell = {
    border: "1px solid #ddd",
    padding: "10px",
    verticalAlign: "top",
  };

  // ================================
  // UI
  // ================================

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "60% 40%",
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fa",
      }}
    >
      {/* ================================
          LEFT SIDE
      ================================= */}

      <main
        style={{
          background: "white",
          padding: "40px",
          overflowY: "auto",
        }}
      >
        <h1>Log Customer Complaint</h1>

        <p>API & FDF Quality Assurance Module</p>

        <hr />

        <h3>1. COMPLAINT INFORMATION</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <Field
            label="Complaint Source"
            value="Customer"
          />

          <Field
            label="Customer Name"
            value="ABC Healthcare Pharmacy"
          />

          <Field
            label="Product Name"
            value={result?.product_name || ""}
            placeholder="Awaiting AI extraction..."
          />

          <Field
            label="Product Strength / Grade"
            value="500 mg"
          />

          <Field
            label="Batch / Lot Number"
            value={result?.batch_number || ""}
            placeholder="Awaiting AI extraction..."
          />

          <Field
            label="Affected Quantity"
            value="25 packs"
          />

          <Field
            label="Manufacturing Date"
            value="Not provided"
          />

          <Field
            label="Expiry Date"
            value="Not provided"
          />
        </div>

        <h3 style={{ marginTop: "30px" }}>
          2. FACILITY & MATERIAL IMPACT
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <Field
            label="Originating Site"
            value={result?.originating_site || ""}
            placeholder="Awaiting AI classification..."
          />

          <Field
            label="Impacted Materials"
            value={result?.impacted_materials || ""}
            placeholder="Awaiting AI extraction..."
          />
        </div>

        <h3 style={{ marginTop: "30px" }}>
          3. DEFECT ANALYSIS
        </h3>

        <Field
          label="Complaint Category"
          value="Packaging Defect"
        />

        <p>
          <strong>Complaint Description</strong>
        </p>

        <textarea
          value={result?.defect_summary || ""}
          placeholder="AI will synthesize the complaint..."
          readOnly
          rows={5}
          style={{
            width: "95%",
            padding: "12px",
            resize: "vertical",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        {/* ================================
            RISK ASSESSMENT
        ================================= */}

        {result && (
          <>
            <h3 style={{ marginTop: "30px" }}>
              4. AI RISK ASSESSMENT
            </h3>

            <div
              style={{
                padding: "20px",
                background: "#f8fafc",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Risk Level:</strong>{" "}
                {result.risk_level}
              </p>

              <p>
                <strong>Reason:</strong>{" "}
                {result.risk_reason}
              </p>

              <p>
                <strong>Suggested Next Action:</strong>
              </p>

              <div
                style={{
                  padding: "12px",
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              >
                {getSuggestedAction()}
              </div>

              <button
                onClick={commitToQMS}
                disabled={committed}
                style={{
                  padding: "12px 20px",
                  marginTop: "15px",
                  cursor: committed
                    ? "default"
                    : "pointer",
                }}
              >
                {committed
                  ? "✓ Committed to QMS Ledger"
                  : "Commit to QMS Ledger"}
              </button>
            </div>
          </>
        )}
      </main>

      {/* ================================
          RIGHT SIDE
      ================================= */}

      <aside
        style={{
          background: "#f8fafc",
          padding: "30px",
          borderLeft: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2>AIVOA Copilot</h2>

        <p>
          Upload a complaint PDF or paste a customer complaint below.
        </p>

        {/* PDF UPLOAD */}

        <div
          style={{
            border: "2px dashed #aaa",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
            background: "white",
          }}
        >
          <p>
            <strong>Upload Complaint PDF</strong>
          </p>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePdfUpload}
            disabled={loading}
          />

          {fileName && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px",
                background: "#f1f5f9",
                borderRadius: "6px",
              }}
            >
              {fileName}
            </div>
          )}
        </div>

        {/* LOADING */}

        {loading && (
          <div
            style={{
              padding: "15px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <strong>AIVOA Copilot</strong>

            <p>
              Analyzing complaint and extracting information...
            </p>
          </div>
        )}

        {/* RESULT MESSAGE */}

        {result && !loading && (
          <div
            style={{
              padding: "15px",
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <strong>AIVOA Copilot</strong>

            {fileName && (
              <p>
                Document <strong>{fileName}</strong> was
                processed successfully.
              </p>
            )}

            <p>
              Complaint information extracted successfully.
            </p>

            <p>
              Initial risk assessment completed.
            </p>

            <hr />

            <strong>AI Recommendation</strong>

            <p>{getSuggestedAction()}</p>
          </div>
        )}

        {/* TEXT COMPLAINT */}

        <p>Or paste a customer complaint:</p>

        <textarea
          value={complaintText}
          onChange={(event) =>
            setComplaintText(event.target.value)
          }
          placeholder="Type or paste a customer complaint..."
          rows={12}
          style={{
            width: "90%",
            padding: "12px",
            resize: "vertical",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <br />
        <br />

        <button
          onClick={analyzeComplaint}
          disabled={loading}
          style={{
            padding: "12px 25px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Analyzing..."
            : "Analyze Complaint"}
        </button>

        <br />
        <br />

        {/* QMS LEDGER BUTTON */}

        <button
          onClick={loadLedger}
          disabled={ledgerLoading}
          style={{
            padding: "12px 25px",
            cursor: ledgerLoading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {ledgerLoading
            ? "Loading Ledger..."
            : "View QMS Ledger"}
        </button>

        <p
          style={{
            marginTop: "30px",
            color: "#777",
          }}
        >
          POWERED BY LANGGRAPH
        </p>
      </aside>

      {/* ================================
          QMS LEDGER
      ================================= */}

      {showLedger && (
        <div
          style={{
            position: "fixed",
            top: "5%",
            left: "5%",
            width: "90%",
            height: "90%",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "25px",
            overflowY: "auto",
            boxShadow: "0 5px 30px rgba(0,0,0,0.2)",
            zIndex: 1000,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2>QMS Complaint Ledger</h2>

            <button
              onClick={() => setShowLedger(false)}
              style={{
                padding: "8px 15px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          <hr />

          {ledger.length === 0 ? (
            <p>
              No complaints have been committed yet.
            </p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th style={tableHeader}>
                      Product
                    </th>

                    <th style={tableHeader}>
                      Batch
                    </th>

                    <th style={tableHeader}>
                      Site
                    </th>

                    <th style={tableHeader}>
                      Defect
                    </th>

                    <th style={tableHeader}>
                      Risk
                    </th>

                    <th style={tableHeader}>
                      Committed
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {ledger.map((item, index) => (
                    <tr key={index}>
                      <td style={tableCell}>
                        {item.product_name || "-"}
                      </td>

                      <td style={tableCell}>
                        {item.batch_number || "-"}
                      </td>

                      <td style={tableCell}>
                        {item.originating_site || "-"}
                      </td>

                      <td style={tableCell}>
                        {item.defect_summary || "-"}
                      </td>

                      <td style={tableCell}>
                        {item.risk_level || "-"}
                      </td>

                      <td style={tableCell}>
                        {item.committed_at
                          ? new Date(
                              item.committed_at
                            ).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ================================
// REUSABLE FIELD COMPONENT
// ================================

function Field({
  label,
  value,
  placeholder,
}) {
  return (
    <div>
      <p style={{ marginBottom: "6px" }}>
        <strong>{label}</strong>
      </p>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly
        style={{
          width: "90%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "#fafafa",
        }}
      />
    </div>
  );
}

export default App;