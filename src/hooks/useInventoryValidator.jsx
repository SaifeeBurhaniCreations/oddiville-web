import { useCallback } from "react";

export default function useInventoryValidator() {
  // New, simple & practical rules per your instruction
  const STEP_RULES = {
    1: {
      name: "Raw Material",
      requiredColumns: [
        "item",
        "quantity",
        "price",
        "rating",
        "vendor_name",
        "status",
        "truck_weight",
        "truck_number",
        "driver_name",
        "ordered_quantity",
        "received_quantity",
        "order_date",
        "est_arrival",
        "arrival_date",
      ],
      validators: {
        Quantity: (v) =>
          v === "" || v == null
            ? "Quantity is required"
            : isFinite(Number(v))
            ? null
            : "Quantity must be a number",
        HSN: (v) =>
          v === "" || v == null
            ? "HSN is required"
            : /^\d+$/.test(String(v).trim())
            ? null
            : "HSN must be numeric",
      },
    },
    2: {
      name: "Production",
      requiredColumns: [
        "product_name",
        "supervisor",
        "lane",
        "rating",
        "quantity",
        "recovery",
        "start",
        "end",
        "status",
      ],
      validators: {
        Quantity: (v) =>
          v === "" || v == null
            ? "Quantity is required"
            : isFinite(Number(v))
            ? null
            : "Quantity must be a number",
      },
    },
    3: {
      name: "Chamber Stock",
      requiredColumns: [
        "product_name",
        "category",
        "chamber",
        "rating",
        "quantity",
        "recovery",
        "start",
        "end",
        "status",
      ],
      validators: {
        Quantity: (v) =>
          v === "" || v == null
            ? "Quantity is required"
            : isFinite(Number(v))
            ? null
            : "Quantity must be a number",
      },
    },
    4: {
      name: "Dispatch",
      requiredColumns: [
        "raw_material_name",
        "customer_name",
        "product_name",
        "amount",
        "address",
        "postal_code",
        "status",
        "country",
        "state",
        "city",
        "dispatch_date",
        "est_delivered_date",
        "delivered_date",
      ],
      validators: {
        Quantity: (v) =>
          v === "" || v == null
            ? "Quantity is required"
            : isFinite(Number(v))
            ? null
            : "Quantity must be a number",
      },
    },
  };

  const normalize = (s) => (s == null ? "" : String(s).trim().toLowerCase());

  const rowsToObjects = (rows2D) => {
    if (!Array.isArray(rows2D) || rows2D.length === 0)
      return { headers: [], headerNormToOriginal: {}, objects: [] };

    const rawHeaders = rows2D[0].map((h) => (h == null ? "" : String(h)));
    const headerNormToOriginal = {};
    const normalizedHeaders = rawHeaders.map((h) => {
      const n = normalize(h);
      // preserve the first original header encountered for display
      if (!(n in headerNormToOriginal))
        headerNormToOriginal[n] = h == null ? "" : String(h).trim();
      return n;
    });

    const dataRows = rows2D.slice(1);
    const objects = dataRows.map((row) => {
      const obj = {};
      for (let i = 0; i < normalizedHeaders.length; i++) {
        const key =
          headerNormToOriginal[normalizedHeaders[i]] || normalizedHeaders[i];
        obj[key] = row && i < row.length ? row[i] : "";
      }
      return obj;
    });

    return {
      headers: rawHeaders,
      headerNormToOriginal,
      objects,
      normalizedHeaders,
    };
  };

  const validateExcel = useCallback((rows2D, step = 1) => {
    const rule = STEP_RULES[step];
    if (!rule) {
      return {
        errors: [
          {
            column: "global",
            issues: [{ row: 0, message: `No rules defined for step ${step}` }],
          },
        ],
        mappedRows: [],
      };
    }

    const { headerNormToOriginal, objects, normalizedHeaders } =
      rowsToObjects(rows2D);

    // build normalized map of available headers to original for robust matching
    // adding the headers to the table
    const availableNorms = {};
    Object.keys(headerNormToOriginal).forEach((norm) => {
      availableNorms[norm] = headerNormToOriginal[norm];
    });

    const requiredNormalized = rule.requiredColumns.map((c) => normalize(c));

    // If a required column isn't present at all (after lenient normalization), create an error
    const missingColumns = requiredNormalized.filter(
      (req) => !(req in availableNorms)
    );
    const errorsByColumn = {};

    missingColumns.forEach((missNorm) => {
      const display =
        rule.requiredColumns.find((rc) => normalize(rc) === missNorm) ||
        missNorm;
      errorsByColumn[display] = {
        column: display,
        issues: [{ row: 0, message: `Missing required column: ${display}` }],
      };
    });

    // Validate each data row for existent required columns
    objects.forEach((rowObj, idx) => {
      const rowNumber = idx + 2; // because sheet rows: headers at 1, data starts at row 2
      // for each required column that exists, validate presence/value
      rule.requiredColumns.forEach((reqCol) => {
        const normReq = normalize(reqCol);
        // find matching original header key if available
        const originalHeader = availableNorms[normReq];
        if (!originalHeader) {
          // column missing already accounted for above
          return;
        }
        const value = rowObj[originalHeader];
        if (value === "" || value == null) {
          const display = originalHeader;
          errorsByColumn[display] = errorsByColumn[display] || {
            column: display,
            issues: [],
          };
          errorsByColumn[display].issues.push({
            row: rowNumber,
            message: `${display} is required`,
          });
        } else {
          // run optional validator for this column
          const validatorFn = rule.validators && rule.validators[reqCol];
          if (typeof validatorFn === "function") {
            const maybeMsg = validatorFn(value);
            if (maybeMsg) {
              const display = originalHeader;
              errorsByColumn[display] = errorsByColumn[display] || {
                column: display,
                issues: [],
              };
              errorsByColumn[display].issues.push({
                row: rowNumber,
                message: maybeMsg,
              });
            }
          }
        }
      });

      if (rule.validators) {
        Object.keys(rule.validators).forEach((col) => {
          const normCol = normalize(col);
          const originalHeader = availableNorms[normCol];
          if (!originalHeader) return;
        });
      }
    });

    const errors = Object.keys(errorsByColumn).map((k) => errorsByColumn[k]);

    const mappedRows = objects.map((r) => {
      const mapped = {};
      Object.keys(r).forEach((k) => {
        const trimmedKey = k == null ? "" : String(k).trim();
        mapped[trimmedKey] = r[k];
      });
      // unique id: use crypto if available else fallback
      try {
        mapped._id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      } catch {
        mapped._id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      }
      return mapped;
    });

    return { errors, mappedRows };
  }, []);

  return { validateExcel };
}
