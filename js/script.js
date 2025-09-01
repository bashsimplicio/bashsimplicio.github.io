const predefinedRows = ["Name", "Date Executed", "Created by"];
const predefinedHeaders = ["Test Case ID", "Description", "Priority", "Status"];

const dropdownOptions = {
  "Priority": ["High", "Medium", "Low"],
  "Status": ["Passed", "Failed", "Blocked"]
};

let metaRows = [];
let tableHeaders = [];

function init() {
  const rowContainer = document.getElementById("row-buttons");
  predefinedRows.forEach(r => {
    let btn = document.createElement("button");
    btn.textContent = r;
    btn.onclick = () => addPredefined("row", r, btn);
    rowContainer.appendChild(btn);
  });

  const headerContainer = document.getElementById("header-buttons");
  predefinedHeaders.forEach(h => {
    let btn = document.createElement("button");
    btn.textContent = h;
    btn.onclick = () => addPredefined("header", h, btn);
    headerContainer.appendChild(btn);
  });

  renderTable();
}

function addPredefined(type, value, btn) {
  let list = type === "row" ? metaRows : tableHeaders;
  if (!list.includes(value)) {
    list.push(value);
    btn.disabled = true;
    renderTable();
  }
}

function addCustom(type) {
  let input = document.getElementById(type === "row" ? "custom-row" : "custom-header");
  let error = document.getElementById(type === "row" ? "row-error" : "header-error");
  let value = input.value.trim();
  if (!value) return;

  let list = type === "row" ? metaRows : tableHeaders;
  if (list.some(item => item.toLowerCase() === value.toLowerCase())) {
    error.textContent = `${value} already exists!`;
    setTimeout(() => error.textContent = "", 2000);
    return;
  }

  list.push(value);
  input.value = "";
  renderTable();
}

function removeRow(row) {
  metaRows = metaRows.filter(r => r !== row);
  reenableButton(predefinedRows, row, "row-buttons");
  renderTable();
}

function removeHeader(header) {
  tableHeaders = tableHeaders.filter(h => h !== header);
  reenableButton(predefinedHeaders, header, "header-buttons");
  renderTable();
}

function reenableButton(predefined, value, containerId) {
  if (predefined.includes(value)) {
    const container = document.getElementById(containerId);
    [...container.children].forEach(btn => {
      if (btn.textContent === value) btn.disabled = false;
    });
  }
}

function renderTable() {
  const preview = document.getElementById("preview");
  preview.innerHTML = "";

  if (metaRows.length === 0 && tableHeaders.length === 0) return;

  let table = document.createElement("table");

  // Metadata rows
  metaRows.forEach(row => {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = tableHeaders.length || 1;
    td.textContent = row;
    let removeBtn = document.createElement("span");
    removeBtn.textContent = "❌";
    removeBtn.className = "remove-btn";
    removeBtn.onclick = () => removeRow(row);
    td.appendChild(removeBtn);
    tr.appendChild(td);
    table.appendChild(tr);
  });

  // Headers
  if (tableHeaders.length > 0) {
    let tr = document.createElement("tr");
    tableHeaders.forEach(header => {
      let th = document.createElement("th");
      th.textContent = header;
      let removeBtn = document.createElement("span");
      removeBtn.textContent = "❌";
      removeBtn.className = "remove-btn";
      removeBtn.onclick = () => removeHeader(header);
      th.appendChild(removeBtn);
      tr.appendChild(th);
    });
    table.appendChild(tr);

    // Data row
    let dataRow = document.createElement("tr");
    tableHeaders.forEach(header => {
      let td = document.createElement("td");
      if (dropdownOptions[header]) {
        let select = document.createElement("select");
        dropdownOptions[header].forEach(opt => {
          let option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          select.appendChild(option);
        });
        td.appendChild(select);
      }
      dataRow.appendChild(td);
    });
    table.appendChild(dataRow);
  }

  preview.appendChild(table);
}

// Download CSV
downloadBtn.addEventListener('click', () => {
    if (metaRows.length === 0 || tableHeaders.length === 0) {
        alert("⚠️ Please add at least one table content AND one header before downloading.");
        return;
    }

    let csvContent = "";

    // Metadata
    metaRows.forEach(row => {
        csvContent += `${row},\n`;
    });

    // Headers
    csvContent += tableHeaders.join(",") + "\n";

    // Dropdown options row (if any)
    let optionsRow = tableHeaders.map(h => dropdownOptions[h]?.join("/") || "");
    if (optionsRow.some(opt => opt !== "")) {
        csvContent += optionsRow.join(",") + "\n";
    }

    // Empty row for user to fill
    csvContent += ",".repeat(tableHeaders.length - 1) + "\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "test_plan.csv";
    link.click();
});

init();
