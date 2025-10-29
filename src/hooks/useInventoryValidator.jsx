import { useCallback } from "react";

export default function useInventoryValidator() {
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
        item: (v) =>
          !v || String(v).trim() === "" ? "Item name is required" : null,
        quantity: (v) =>
          v === "" || v == null
            ? "Quantity is required"
            : isFinite(Number(v))
            ? null
            : "Quantity must be a valid number",
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
        product_name: (v) =>
          !v || String(v).trim() === ""
            ? "Product name is required"
            : null,
        quantity: (v) =>
          v === "" || v == null
            ? "Quantity is required"
            : isFinite(Number(v))
            ? null
            : "Quantity must be a valid number",
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
        product_name: (v) =>
          !v || String(v).trim() === ""
            ? "Product name is required"
            : null,
        chamber: (v) =>
          !v || String(v).trim() === ""
            ? "Chamber is required"
            : null,
        quantity: (v) =>
          v === "" || v == null
            ? "Quantity is required"
            : isFinite(Number(v))
            ? null
            : "Quantity must be a valid number",
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
        raw_material_name: (v) =>
          !v || String(v).trim() === ""
            ? "Raw material name is required"
            : null,
        customer_name: (v) =>
          !v || String(v).trim() === ""
            ? "Customer name is required"
            : null,
        product_name: (v) =>
          !v || String(v).trim() === ""
            ? "Product name is required"
            : null,
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

    const { headerNormToOriginal, objects } = rowsToObjects(rows2D);
    const availableNorms = {};
    Object.keys(headerNormToOriginal).forEach((norm) => {
      availableNorms[norm] = headerNormToOriginal[norm];
    });

    const requiredNormalized = rule.requiredColumns.map((c) => normalize(c));
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

    objects.forEach((rowObj, idx) => {
      const rowNumber = idx + 2;

      Object.keys(rule.validators).forEach((col) => {
        const normCol = normalize(col);
        const originalHeader = availableNorms[normCol];
        if (!originalHeader) return;

        const value = rowObj[originalHeader];
        const validatorFn = rule.validators[col];
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
      });
    });

    const errors = Object.keys(errorsByColumn).map((k) => errorsByColumn[k]);

    const mappedRows = objects.map((r) => {
      const mapped = {};
      Object.keys(r).forEach((k) => {
        const trimmedKey = k == null ? "" : String(k).trim();
        mapped[trimmedKey] = r[k];
      });
      mapped._id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      return mapped;
    });

    return { errors, mappedRows };
  }, []);

  return { validateExcel };
}
