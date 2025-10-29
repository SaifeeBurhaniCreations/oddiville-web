// OldInventory.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import useStep from "@/hooks/useStep";
import useInventoryValidator from "@/hooks/useInventoryValidator.jsx";
import ModalAccordion from "@/components/modals/ModalAccordion.jsx";
import ImageUploader from "../../Shared/oldInventory/ImageUploader";
import ExcelUploader from "../../Shared/oldInventory/ExcelUploader";

/**
 * Rewritten OldInventory component.
 * - leaner
 * - dynamic steps
 * - uses useStep + useInventoryValidator
 * - shows accordion modal (Modal UI: C) when there are validation errors
 */

const STEPS_CONFIG = [
  {
    key: 1,
    title: "Raw Material entry",
    acceptsImage: true,
    buttonLabel: "Add Raw Material",
  },
  {
    key: 2,
    title: "Production entry",
    acceptsImage: false,
    buttonLabel: "Add Production",
  },
  {
    key: 3,
    title: "ChamberStock entry",
    acceptsImage: false,
    buttonLabel: "Add ChamberStock",
  },
  {
    key: 4,
    title: "Dispatch Order entry",
    acceptsImage: true,
    buttonLabel: "Add Dispatch Order",
  },
];

export default function OldInventory() {
  const { step, next, prev, setStep } = useStep(1, STEPS_CONFIG.length);
  const { validateExcel } = useInventoryValidator();

  const [excelRows, setExcelRows] = useState([]); // raw 2D rows as returned by XLSX.utils.sheet_to_json(..., { header: 1 })
  const [parsedPreview, setParsedPreview] = useState([]); // convenience for previewing mapped rows
  const [challan, setChallan] = useState({ rawMaterial: [], dispatch: [] });
  const [showModal, setShowModal] = useState(false);
  const [modalErrors, setModalErrors] = useState([]);
  const [nextStepTitle, setNextStepTitle] = useState("");

  const handleExcelChange = (event) => {
    const excelFile = event.target.files && event.target.files[0];
    if (!excelFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false,
      });
      setExcelRows(rows || []);
      // quick preview: keep first 20 rows (or so)
      const previewRows = (rows || []).slice(0, 21);
      setParsedPreview(previewRows);
    };
    reader.readAsArrayBuffer(excelFile);
  };

  const currentCfg = STEPS_CONFIG.find((s) => s.key === step);

  const onClickNext = () => {
    // run validation against the uploaded excelRows
    const { errors, mappedRows } = validateExcel(excelRows, step);

    if (errors && errors.length) {
      // show modal accordion
      setModalErrors(errors);
      setShowModal(true);
      return;
    }

    // no errors => keep the mapped rows someplace (in memory for now) and advance
    // you can change this to send the mappedRows to backend here
    console.log(`Step ${step} validated, rows:`, mappedRows.length);
    // For demo: keep preview of mapped rows truncated
    setParsedPreview([
      Object.keys(mappedRows[0] || {}).map((k) => k),
      ...mappedRows.slice(0, 20).map((r) => Object.values(r)),
    ]);
    // move to next step (if any)
    if (step < STEPS_CONFIG.length) {
      const nextCfg = STEPS_CONFIG.find((s) => s.key === step + 1);
      setNextStepTitle(nextCfg ? nextCfg.title : "");
      // Show confirm modal pattern from your original flow
      // Here we just go next immediately for simplicity - you can prompt for confirmation if desired
      next();
      // clear the excelRows for the next step so user uploads new sheet
      setExcelRows([]);
    } else {
      // finished all steps
      alert(
        "All steps completed. Ready to submit to backend (implement API call)."
      );
    }
  };

  return (
    <div className="container d-flex flex-column gap-3">
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex flex-column gap-3">
            {STEPS_CONFIG.slice(0, 2).map((cfg) => (
              <div key={cfg.key} className="card">
                <div className="d-flex justify-content-between align-items-center card-header">
                  <h6>{cfg.title}</h6>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-xs"
                    disabled={cfg.key !== step}
                  >
                    {cfg.title} active?
                  </button>
                </div>
                <div className="card-body">
                  <ExcelUploader
                    disabled={cfg.key !== step}
                    onFileChange={handleExcelChange}
                  />
                  {cfg.acceptsImage && (
                    <ImageUploader
                      name="Upload Challan"
                      multiple={false}
                      value={challan.rawMaterial}
                      onChange={(arr) =>
                        setChallan((prev) => ({ ...prev, rawMaterial: arr }))
                      }
                      disabled={cfg.key !== step}
                      className="mt-3"
                    />
                  )}
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        // run validation and move next only if no errors
                        onClickNext();
                      }}
                      disabled={cfg.key !== step}
                    >
                      {cfg.buttonLabel}
                    </button>

                    {step > 1 && cfg.key === step && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => prev()}
                      >
                        Back
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <div className="d-flex flex-column gap-3">
            {STEPS_CONFIG.slice(2).map((cfg) => (
              <div key={cfg.key} className="card">
                <div className="d-flex justify-content-between align-items-center card-header">
                  <h6>{cfg.title}</h6>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-xs"
                    disabled={cfg.key !== step}
                  >
                    {cfg.title} active?
                  </button>
                </div>
                <div className="card-body">
                  <ExcelUploader
                    disabled={cfg.key !== step}
                    onFileChange={handleExcelChange}
                  />
                  {cfg.acceptsImage && (
                    <ImageUploader
                      name={"Upload Dispatch Challan"}
                      multiple={false}
                      value={challan.dispatch}
                      onChange={(arr) =>
                        setChallan((prev) => ({ ...prev, dispatch: arr }))
                      }
                      disabled={cfg.key !== step}
                      className="mt-3"
                    />
                  )}
                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        onClickNext();
                      }}
                      disabled={cfg.key !== step}
                    >
                      {cfg.buttonLabel}
                    </button>

                    {step > 1 && cfg.key === step && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => prev()}
                      >
                        Back
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview table */}
      <div className="row">
        <div className="col-md-12">
          {parsedPreview && parsedPreview.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h6>List New Added Inventory (Preview)</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table align-items-center mb-0">
                    <thead>
                      <tr>
                        {parsedPreview[0].map((headerCell, idx) => (
                          <th key={idx}>{headerCell}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedPreview.slice(1).map((row, ridx) => (
                        <tr key={ridx}>
                          {row.map((cell, cidx) => (
                            <td key={cidx}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Accordion for Errors */}
      <ModalAccordion
        isOpen={showModal}
        title={`Validation errors - ${
          STEPS_CONFIG.find((s) => s.key === step)?.title || ""
        }`}
        errors={modalErrors}
        onClose={() => {
          setShowModal(false);
          setModalErrors([]);
        }}
      />
    </div>
  );
}
