(function() {
    // Purana UI agar active ho toh remove karo
    const oldApp = document.getElementById('tms-auto-approve-app');
    if (oldApp) oldApp.remove();

    // 1. Classic Light/White UI Overlay Create Karna
    const overlay = document.createElement('div');
    overlay.id = 'tms-auto-approve-app';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #f1f5f9;
        color: #0f172a;
        z-index: 999999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 15px;
    `;

    overlay.innerHTML = `
        <!-- HEADER WITH BLUE TO RED GRADIENT -->
        <div style="
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #be123c 100%);
            padding: 18px 25px;
            border-radius: 12px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        ">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 26px;">⚡</span>
                <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                    TMS Auto Approve Portal
                </h2>
            </div>
            <button id="close-tms-app" style="
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.4);
                padding: 8px 18px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                backdrop-filter: blur(4px);
                transition: all 0.2s ease;
            ">Close App</button>
        </div>
        
        <!-- CARD 1: UPLOAD SECTION -->
        <div style="
            background: #ffffff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
            border: 1px solid #e2e8f0;
        ">
            <h3 style="margin-top: 0; color: #1e293b; font-size: 15px; font-weight: 600; margin-bottom: 12px;">
                📂 Step 1: Upload CSV File
            </h3>
            <div style="display: flex; gap: 15px; align-items: center;">
                <input type="file" id="csv-file-input" accept=".csv, .txt" style="
                    background: #f8fafc;
                    color: #334155;
                    padding: 10px 14px;
                    border-radius: 8px;
                    border: 1px solid #cbd5e1;
                    cursor: pointer;
                    font-size: 14px;
                " />
                <button id="start-process-btn" disabled style="
                    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
                    color: white;
                    border: none;
                    padding: 11px 26px;
                    border-radius: 8px;
                    cursor: not-allowed;
                    font-weight: 600;
                    opacity: 0.5;
                    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
                    transition: all 0.2s ease;
                ">Start Auto Approve</button>
            </div>
        </div>

        <!-- CARD 2: DATA TABLE GRID -->
        <div style="
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
            padding: 20px;
            overflow: hidden;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600;">
                    📊 Step 2: Live Request Execution Status
                </h3>
                <span id="progress-counter" style="
                    background: #eff6ff;
                    color: #1d4ed8;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 13px;
                    border: 1px solid #bfdbfe;
                ">Rows Loaded: 0</span>
            </div>
            
            <div style="flex: 1; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 13px;">
                    <thead style="
                        position: sticky;
                        top: 0;
                        background: linear-gradient(90deg, #1e3a8a 0%, #9f1239 100%);
                        color: #ffffff;
                        z-index: 10;
                    ">
                        <tr>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">#</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">External Ref Id</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Request Type</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Contract Type</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Vendor Name</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Vehicle Number</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">From Date</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0;">To Date</th>
                            <th style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">API Status</th>
                        </tr>
                    </thead>
                    <tbody id="data-table-body">
                        <tr>
                            <td colspan="9" style="padding: 40px; text-align: center; color: #94a3b8; font-weight: 500;">
                                Awaiting CSV file upload to start...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    let csvData = [];
    const fileInput = document.getElementById('csv-file-input');
    const startBtn = document.getElementById('start-process-btn');
    const tableBody = document.getElementById('data-table-body');
    const progressCounter = document.getElementById('progress-counter');
    const closeBtn = document.getElementById('close-tms-app');

    closeBtn.onclick = () => {
        if(confirm("Dashboard Exit karein?")) overlay.remove();
    };

    function getCsrfToken() {
        const metaTag = document.querySelector('meta[name="csrf-token"]') || document.querySelector('meta[name="_csrf"]');
        if (metaTag && metaTag.content) return metaTag.content;
        
        const match = document.cookie.match(new RegExp('(^| )' + 'CSRF-TOKEN' + '=([^;]+)')) ||
                      document.cookie.match(new RegExp('(^| )' + 'XSRF-TOKEN' + '=([^;]+)'));
        if (match) return decodeURIComponent(match[2]);

        return "6npvHHFn-5Y3scwxYLwpQcuB2XRrhnZe3FLI"; 
    }

    function cleanValue(val) {
        if (!val) return '';
        return val.toString().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "").trim();
    }

    // Dynamic Date Formatter based purely on CSV input
    function formatDateTime(dtStr) {
        if (!dtStr) return "";
        dtStr = dtStr.trim();
        // Agar date me "29-07-2026 00:00" format hai, toh last me ":00" add kar dega
        if (/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/.test(dtStr)) {
            return dtStr + ":00";
        }
        return dtStr;
    }

    function getVendorId(vendorName) {
        if (!vendorName) return 203;
        const name = vendorName.toUpperCase();
        if (name.includes("DELHIVERY LIMITED")) return 203;
        if (name.includes("XPRESSBEES")) return 447;
        if (name.includes("SHADOWFAX")) return 286;
        return 203;
    }

    function splitCSVLine(line, delimiter = ',') {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === delimiter && !inQuotes) {
                result.push(current);
                current = '';
            } else current += char;
        }
        result.push(current);
        return result;
    }

    function getRowValue(rowObj, targetNames) {
        const normalizedTargets = targetNames.map(name => name.toLowerCase().replace(/[^a-z0-9]/g, ''));
        for (let rawKey in rowObj) {
            const cleanKey = rawKey.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalizedTargets.includes(cleanKey)) return rowObj[rawKey];
        }
        for (let rawKey in rowObj) {
            const cleanKey = rawKey.toLowerCase();
            for (let term of targetNames) {
                if (cleanKey.includes(term.toLowerCase().trim())) return rowObj[rawKey];
            }
        }
        return '';
    }

    function parseCSVText(text) {
        text = text.replace(/^\uFEFF/, '');
        const lines = text.split(/\r?\n/);
        if (lines.length === 0) return [];

        const firstLine = lines[0];
        const delimiter = (firstLine.includes('\t') && !firstLine.includes(',')) ? '\t' : ',';
        const headers = splitCSVLine(firstLine, delimiter).map(h => cleanValue(h));
        const parsedRows = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = splitCSVLine(lines[i], delimiter);
            let rowObj = {};
            headers.forEach((header, index) => {
                rowObj[header] = values[index] || '';
            });

            parsedRows.push({
                extRefId: cleanValue(getRowValue(rowObj, ['Enter External Ref Id', 'external ref id', 'extrefid'])),
                reqType: cleanValue(getRowValue(rowObj, ['Select Request Type', 'request type'])) || 'RECALL',
                contractType: cleanValue(getRowValue(rowObj, ['Select Contract Type', 'contract type'])) || 'COLOADER',
                vendorName: cleanValue(getRowValue(rowObj, ['Type Vendor name', 'vendor name'])) || 'DELHIVERY LIMITED',
                vehicleNumber: cleanValue(getRowValue(rowObj, ['Input vehicle number', 'vehicle number'])) || 'HR47G0186',
                fromDate: formatDateTime(cleanValue(getRowValue(rowObj, ['Select from date', 'from date']))),
                toDate: formatDateTime(cleanValue(getRowValue(rowObj, ['Select to date', 'to date'])))
            });
        }
        return parsedRows;
    }

    function renderTable(rows) {
        tableBody.innerHTML = '';
        rows.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #f1f5f9';
            tr.style.transition = 'background-color 0.2s ease';
            tr.innerHTML = `
                <td style="padding: 10px; color: #64748b;">${index + 1}</td>
                <td style="padding: 10px; font-weight: 600; color: #0f172a;">${row.extRefId || '-'}</td>
                <td style="padding: 10px; color: #475569;">${row.reqType || '-'}</td>
                <td style="padding: 10px; color: #475569;">${row.contractType || '-'}</td>
                <td style="padding: 10px; color: #475569;">${row.vendorName || '-'}</td>
                <td style="padding: 10px; color: #475569;">${row.vehicleNumber || '-'}</td>
                <td style="padding: 10px; color: #475569;">${row.fromDate || '-'}</td>
                <td style="padding: 10px; color: #475569;">${row.toDate || '-'}</td>
                <td id="status-cell-${index + 1}" style="padding: 10px; text-align: center; color: #94a3b8; font-weight: 500;">Pending...</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function updateRowStatus(index, text, statusType) {
        const cell = document.getElementById(`status-cell-${index}`);
        if (!cell) return;
        cell.innerText = text;
        cell.style.fontWeight = '600';
        
        if (statusType === 'processing') {
            cell.style.color = '#0284c7';
            cell.parentElement.style.background = '#f0f9ff';
        } else if (statusType === 'success') {
            cell.style.color = '#15803d';
            cell.parentElement.style.background = '#f0fdf4';
        } else if (statusType === 'error') {
            cell.style.color = '#b91c1c';
            cell.parentElement.style.background = '#fef2f2';
        }
    }

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            csvData = parseCSVText(e.target.result);
            if(csvData.length > 0) {
                renderTable(csvData);
                progressCounter.innerText = `Rows Loaded: ${csvData.length} | Processed: 0/${csvData.length}`;
                startBtn.disabled = false;
                startBtn.style.cursor = 'pointer';
                startBtn.style.opacity = '1';
            }
        };
        reader.readAsText(file);
    });

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function extractLineItemId(responseData) {
        try {
            if (responseData && responseData.data && responseData.data.data && Array.isArray(responseData.data.data)) {
                if (responseData.data.data.length > 0) {
                    return responseData.data.data[0].transport_request_line_item_id;
                }
            }
        } catch (e) {
            console.error("Error extracting ID:", e);
        }
        return null;
    }

    startBtn.onclick = async () => {
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        fileInput.disabled = true;

        for (let i = 0; i < csvData.length; i++) {
            const row = csvData[i];
            const displayIndex = i + 1;
            
            if (!row.extRefId || row.extRefId === '-' || row.extRefId.replace(/\s/g, '').length === 0) {
                updateRowStatus(displayIndex, "Skipped: Empty Ref ID", "error");
                continue;
            }

            updateRowStatus(displayIndex, "Searching ID...", "processing");
            progressCounter.innerText = `Rows Loaded: ${csvData.length} | Processed: ${displayIndex}/${csvData.length}`;

            const activeCsrf = getCsrfToken();
            const currentTimestamp = Math.floor(Date.now() / 1000).toString();
            let lineItemId = null;

            // ---- STEP 1: SEARCH REQUEST (GET) ----
            try {
                const searchUrl = `http://10.24.1.71/tms-routes-api/tms-proxy-sal/dashboard/transport_request_line_item/search?sort_field=request_line_item_id&total_count=true&page_size=20&page_num=1&request_external_id=${encodeURIComponent(row.extRefId)}&sort_type=DESC&request_type=${encodeURIComponent(row.reqType)}`;
                
                let searchResponse = await fetch(searchUrl, {
                    method: 'GET',
                    headers: {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9,hi;q=0.8",
                        "content-type": "application/json",
                        "csrf-token": activeCsrf,
                        "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Linux\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 EKCL/website/1",
                        "x_request_id": currentTimestamp,
                        "x_requested_by": "TRFrontEnd",
                        "x_tenant_id": "TRANSPORT"
                    },
                    referrer: `http://10.24.1.71/tms/trip-request-management/trip-request-dashboard?extrefIDTR=${encodeURIComponent(row.extRefId)}&request_type=${encodeURIComponent(row.reqType)}`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    mode: "cors",
                    credentials: "include"
                });

                if (!searchResponse.ok) {
                    throw new Error(`HTTP Error ${searchResponse.status}`);
                }

                let searchData = await searchResponse.json();
                lineItemId = extractLineItemId(searchData);

            } catch (err) {
                updateRowStatus(displayIndex, `❌ Search Failed: ${err.message}`, "error");
                continue;
            }

            if (!lineItemId) {
                updateRowStatus(displayIndex, `❌ Ref ID '${row.extRefId}' Not Found`, "error");
                continue;
            }

            // ---- STEP 2: APPROVE REQUEST (PUT) ----
            updateRowStatus(displayIndex, `Approving ID: ${lineItemId}...`, "processing");
            await sleep(300);

            try {
                const targetVendorId = parseInt(getVendorId(row.vendorName), 10);
                const cleanContractType = row.contractType.replace('-', '').toUpperCase();

                const approvePayload = {
                    trip_contract_type: cleanContractType || "COLOADER",
                    vendor_id: targetVendorId,
                    vendor_name: row.vendorName || "DELHIVERY LIMITED",
                    vehicle_id: row.vehicleNumber || "HR47G0186",
                    expected_delivery_from_time: row.fromDate,
                    expected_delivery_to_time: row.toDate
                };

                const approveUrl = `http://10.24.1.71/tms-routes-api/tms-proxy-sal/transport_request_line_item/${lineItemId}/approve`;

                let approveResponse = await fetch(approveUrl, {
                    method: "PUT",
                    headers: {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9,hi;q=0.8",
                        "content-type": "application/json",
                        "csrf-token": activeCsrf,
                        "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Linux\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 EKCL/website/1",
                        "x_request_id": currentTimestamp,
                        "x_requested_by": "TRFrontEnd",
                        "x_tenant_id": "TRANSPORT"
                    },
                    referrer: `http://10.24.1.71/tms/trip-request-management/trip-request-dashboard?extrefIDTR=${encodeURIComponent(row.extRefId)}&request_type=${encodeURIComponent(row.reqType)}`,
                    referrerPolicy: "strict-origin-when-cross-origin",
                    mode: "cors",
                    credentials: "include",
                    body: JSON.stringify(approvePayload)
                });

                if (approveResponse.ok) {
                    updateRowStatus(displayIndex, `✅ Approved (ID: ${lineItemId})`, "success");
                } else {
                    let errRes = await approveResponse.json().catch(() => ({}));
                    let errMsg = errRes.message || errRes.error_response?.error_description || `HTTP ${approveResponse.status}`;
                    updateRowStatus(displayIndex, `❌ Approve Failed: ${errMsg}`, "error");
                }

            } catch (error) {
                updateRowStatus(displayIndex, `❌ ${error.message}`, "error");
            }

            await sleep(600);
        }

        alert("Processing Finished Successfully!");
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        fileInput.disabled = false;
    };
})();

