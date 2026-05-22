// --- INIT & AUTH ---
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('app_password')) localStorage.setItem('app_password', 'admin123');
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const ts = document.getElementById('theme-switch');
        if(ts) ts.checked = true;
    }

    // Search product in Sales
    const spSearch = document.getElementById('search-product-sales');
    if(spSearch) {
        spSearch.addEventListener('input', (e) => {
            const kw = e.target.value.toLowerCase();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(kw) || p.id.toLowerCase().includes(kw) ||
                (p.specs && (p.specs.power.toLowerCase().includes(kw) || p.specs.component_type.toLowerCase().includes(kw)))
            );
            renderSalesProducts(filtered);
        });
    }

    // Search product in Inventory
    const spInv = document.getElementById('search-product');
    if(spInv) {
        spInv.addEventListener('input', () => {
            renderInventory();
        });
    }

    // Search Import History
    const sImport = document.getElementById('search-import-history');
    if(sImport) {
        sImport.addEventListener('input', () => {
            renderInventoryTickets();
        });
    }

    // Search Export History
    const sExport = document.getElementById('search-export-history');
    if(sExport) {
        sExport.addEventListener('input', () => {
            renderInventoryTickets();
        });
    }

    // Search Customer
    const sCus = document.getElementById('search-customer');
    if(sCus) {
        sCus.addEventListener('input', (e) => {
            const kw = e.target.value.toLowerCase();
            const filtered = customers.filter(c => 
                c.name.toLowerCase().includes(kw) || c.id.toLowerCase().includes(kw) || (c.phone||'').includes(kw)
            );
            renderCRM(filtered, suppliers);
        });
    }

    // Search Supplier
    const sSup = document.getElementById('search-supplier');
    if(sSup) {
        sSup.addEventListener('input', (e) => {
            const kw = e.target.value.toLowerCase();
            const filtered = suppliers.filter(c => 
                c.name.toLowerCase().includes(kw) || c.id.toLowerCase().includes(kw) || (c.phone||'').includes(kw)
            );
            renderCRM(customers, filtered);
        });
    }

    // Search Quote
    const sQuote = document.getElementById('search-quote');
    if(sQuote) {
        sQuote.addEventListener('input', (e) => {
            const kw = e.target.value.toLowerCase();
            const filtered = quotes.filter(q => {
                const cus = customers.find(c => c.id === q.customer_id);
                const cusName = cus ? cus.name.toLowerCase() : '';
                return q.id.toLowerCase().includes(kw) || cusName.includes(kw);
            });
            renderSales(filtered, contracts);
        });
    }

    // Search Contract
    const sContract = document.getElementById('search-contract');
    if(sContract) {
        sContract.addEventListener('input', (e) => {
            const kw = e.target.value.toLowerCase();
            const filtered = contracts.filter(ct => {
                const cus = customers.find(c => c.id === ct.customer_id);
                const cusName = cus ? cus.name.toLowerCase() : '';
                return ct.id.toLowerCase().includes(kw) || cusName.includes(kw) || ct.quote_id.toLowerCase().includes(kw);
            });
            renderSales(quotes, filtered);
        });
    }
});

let currentUser = null;

function checkLogin() {
    const inputUser = document.getElementById('login-user').value;
    const inputPass = document.getElementById('login-pass').value;
    
    // Check against users array if it exists (from data.js)
    if(typeof users !== 'undefined') {
        const foundUser = users.find(u => u.username === inputUser && u.password === inputPass);
        if(foundUser) {
            currentUser = foundUser;
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';
            initData();
            applyRBAC();
            return;
        }
    }
    
    // Fallback logic
    const sysPass = localStorage.getItem('app_password');
    if (inputUser === 'admin' && inputPass === sysPass) {
        currentUser = { username: 'admin', role: 'admin', name: 'Admin' };
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        initData();
        applyRBAC();
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
}

function applyRBAC() {
    if(!currentUser) return;
    if(currentUser.role === 'view_only') {
        // Add a global class to body to hide edit buttons via CSS
        document.body.classList.add('view-only-mode');
        // Hide Admin tab
        const adminTab = document.getElementById('menu-admin');
        if(adminTab) adminTab.style.display = 'none';
        alert(`Đăng nhập thành công với quyền Xem (View-Only). Chào ${currentUser.name}!`);
    } else {
        document.body.classList.remove('view-only-mode');
        const adminTab = document.getElementById('menu-admin');
        if(adminTab) adminTab.style.display = 'flex';
        alert(`Đăng nhập thành công với quyền Quản trị. Chào ${currentUser.name}!`);
    }
}

function initData() {
    // Inventory
    renderInventory();
    renderInventorySelects();
    // CRM
    renderCRM();
    // Finance
    renderFinance();
    // HR
    renderHR();
    // Sales
    renderSalesProducts(products);
    renderSales();
    renderNotifications();
}

function toggleTheme() {
    const isDark = document.getElementById('theme-switch').checked;
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

// --- NAVIGATION ---
function switchTab(tabId) {
    document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
    
    const targetSec = document.getElementById(tabId);
    if (targetSec) targetSec.classList.add('active');
    
    const targetMenu = document.getElementById('menu-' + tabId);
    if (targetMenu) targetMenu.classList.add('active');
}

function switchSubTab(module, tabId, event) {
    const moduleEl = document.getElementById(module);
    if (!moduleEl) return;
    moduleEl.querySelectorAll('.sub-tab-content').forEach(tab => tab.style.display = 'none');
    moduleEl.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.style.display = 'block';
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}

// --- MODULE: INVENTORY ---
function getProductStock(product) {
    return product.batches ? product.batches.reduce((sum, b) => sum + b.qty, 0) : product.stock;
}

// Carts state
let importCart = [];
let exportCart = [];

function initInventoryDates() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    
    const fromInput = document.getElementById('xnt-date-from');
    const toInput = document.getElementById('xnt-date-to');
    
    if (fromInput && !fromInput.value) {
        fromInput.value = `${y}-${m}-01`;
    }
    if (toInput && !toInput.value) {
        toInput.value = `${y}-${m}-${d}`;
    }
    
    // Default dates for creation forms (datetime-local requires YYYY-MM-DDTHH:MM format)
    const impDate = document.getElementById('import-ticket-date');
    const expDate = document.getElementById('export-ticket-date');
    const localISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    if (impDate && !impDate.value) impDate.value = localISO;
    if (expDate && !expDate.value) expDate.value = localISO;
}

function setXntQuickFilter(type) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    
    const fromInput = document.getElementById('xnt-date-from');
    const toInput = document.getElementById('xnt-date-to');
    
    document.querySelectorAll('.btn-quick-filter').forEach(btn => btn.classList.remove('active'));
    
    if (type === 'today') {
        const dateStr = `${y}-${m}-${d}`;
        if (fromInput) fromInput.value = dateStr;
        if (toInput) toInput.value = dateStr;
        document.getElementById('filter-btn-today').classList.add('active');
    } else if (type === 'this-month') {
        if (fromInput) fromInput.value = `${y}-${m}-01`;
        if (toInput) toInput.value = `${y}-${m}-${d}`;
        document.getElementById('filter-btn-thismonth').classList.add('active');
    } else if (type === 'last-month') {
        const lm = new Date(y, today.getMonth() - 1, 1);
        const lmY = lm.getFullYear();
        const lmM = String(lm.getMonth() + 1).padStart(2, '0');
        const lmLastDay = new Date(lmY, lm.getMonth() + 1, 0).getDate();
        if (fromInput) fromInput.value = `${lmY}-${lmM}-01`;
        if (toInput) toInput.value = `${lmY}-${lmM}-${String(lmLastDay).padStart(2, '0')}`;
        document.getElementById('filter-btn-lastmonth').classList.add('active');
    } else if (type === 'all') {
        if (fromInput) fromInput.value = '';
        if (toInput) toInput.value = '';
        document.getElementById('filter-btn-all').classList.add('active');
    }
    
    renderInventory();
}

function getStockAtDate(productId, dateStr) {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    
    let stock = product.stock; // Current stock
    if (!dateStr) return stock;
    
    const targetDate = new Date(dateStr);
    
    // Traverse tickets in reverse order and revert changes to calculate past stock
    inventory_tickets.forEach(ticket => {
        const ticketDate = new Date(ticket.date);
        if (ticketDate > targetDate) {
            ticket.items.forEach(item => {
                if (item.product_id === productId) {
                    if (ticket.type === 'import') {
                        stock -= item.qty;
                    } else if (ticket.type === 'export') {
                        stock += item.qty;
                    }
                }
            });
        }
    });
    
    return stock;
}

function renderInventory(filteredData = products) {
    initInventoryDates();
    
    const fromVal = document.getElementById('xnt-date-from') ? document.getElementById('xnt-date-from').value : '';
    const toVal = document.getElementById('xnt-date-to') ? document.getElementById('xnt-date-to').value : '';
    
    const searchQ = document.getElementById('search-product') ? document.getElementById('search-product').value.toLowerCase().trim() : '';
    
    const toDisplay = products.filter(p => {
        const matchSearch = p.id.toLowerCase().includes(searchQ) || p.name.toLowerCase().includes(searchQ);
        return matchSearch;
    });
    
    // Re-calculate stock for all products from batches
    products.forEach(p => {
        if (p.batches) {
            p.stock = p.batches.reduce((sum, b) => sum + b.qty, 0);
        }
    });
    
    const tbody = document.getElementById('inventory-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = toDisplay.map(p => {
        let openingStock = p.stock;
        let imported = 0;
        let exported = 0;
        let closingStock = p.stock;
        
        const fromDate = fromVal ? new Date(fromVal + 'T00:00:00') : null;
        const toDate = toVal ? new Date(toVal + 'T23:59:59') : null;
        
        if (fromDate || toDate) {
            if (fromDate) {
                openingStock = getStockAtDate(p.id, fromVal + 'T00:00:00');
            } else {
                openingStock = 0;
            }
            
            inventory_tickets.forEach(ticket => {
                const ticketDate = new Date(ticket.date);
                let inRange = true;
                if (fromDate && ticketDate < fromDate) inRange = false;
                if (toDate && ticketDate > toDate) inRange = false;
                
                if (inRange) {
                    ticket.items.forEach(item => {
                        if (item.product_id === p.id) {
                            if (ticket.type === 'import') {
                                imported += item.qty;
                            } else if (ticket.type === 'export') {
                                exported += item.qty;
                            }
                        }
                    });
                }
            });
            
            closingStock = openingStock + imported - exported;
        } else {
            inventory_tickets.forEach(ticket => {
                ticket.items.forEach(item => {
                    if (item.product_id === p.id) {
                        if (ticket.type === 'import') imported += item.qty;
                        if (ticket.type === 'export') exported += item.qty;
                    }
                });
            });
            openingStock = closingStock - imported + exported;
        }
        
        let statusBadge = '';
        if (closingStock <= 0) {
            statusBadge = '<span class="badge-stock out">Hết hàng</span>';
        } else if (closingStock < p.safe_stock_level) {
            statusBadge = '<span class="badge-stock danger">Dưới định mức</span>';
        } else if (closingStock <= p.safe_stock_level * 1.2) {
            statusBadge = '<span class="badge-stock warning">Cảnh báo</span>';
        } else {
            statusBadge = '<span class="badge-stock success">An toàn</span>';
        }
        
        let batchDetails = '';
        if (p.batches && p.batches.length > 0) {
            const latestBatch = p.batches[p.batches.length - 1];
            batchDetails = `<span style="text-decoration:underline; cursor:pointer; color:var(--primary-color);" onclick="openBatchHistory('${p.id}')">[${latestBatch.ref_no || latestBatch.import_date}] SL: ${latestBatch.qty}</span>`;
        } else {
            batchDetails = '<span style="color:var(--text-muted)">Không có lô</span>';
        }
        
        const noteIcon = `<button class="btn-info" onclick="openProductNote('${p.id}')">i</button>`;
        const rowStyle = p.is_deleted ? 'color: var(--text-muted); background: rgba(0,0,0,0.05);' : '';
        
        let actionBtns = p.is_deleted 
            ? `<button class="btn-action-small secondary" onclick="restoreItem('products', '${p.id}')">Khôi phục</button>
               <button class="btn-action-small danger" style="margin-left:4px;" onclick="hardDeleteItem('products', '${p.id}')">Xóa vĩnh viễn</button>`
            : `<button class="btn-action-small success" onclick="editSKU('${p.id}')">Sửa</button>
               <button class="btn-action-small danger" style="margin-left:4px;" onclick="softDeleteItem('products', '${p.id}')">Xóa</button>`;
               
        return `
            <tr style="${rowStyle}">
                <td><b>${p.id}</b></td>
                <td>${p.name} ${noteIcon} ${p.is_deleted ? '<i>(Đã xóa)</i>' : ''}</td>
                <td>${p.unit || 'cái'}</td>
                <td class="text-right" style="background-color:rgba(99,102,241,0.01)">${openingStock}</td>
                <td class="text-right" style="color:var(--status-daban-text); background-color:rgba(21,128,61,0.01)">+${imported}</td>
                <td class="text-right" style="color:var(--status-chogiao-text); background-color:rgba(194,65,12,0.01)">-${exported}</td>
                <td class="text-right" style="font-weight:bold; background-color:rgba(99,102,241,0.03)">${closingStock}</td>
                <td>${p.safe_stock_level || 0}</td>
                <td>${statusBadge}</td>
                <td>${actionBtns}</td>
            </tr>
        `;
    }).join('');
    
    renderInventorySelects();
    renderInventoryTickets();
}

function renderInventorySelects() {
    const activeProducts = products.filter(p => !p.is_deleted);
    const productOpts = '<option value="">-- Chọn sản phẩm --</option>' + activeProducts.map(p => `<option value="${p.id}">${p.id} - ${p.name} (Tồn: ${p.stock} ${p.unit || 'cái'})</option>`).join('');
    
    const impProductSel = document.getElementById('import-product-select');
    const expProductSel = document.getElementById('export-product-select');
    if(impProductSel) impProductSel.innerHTML = productOpts;
    if(expProductSel) expProductSel.innerHTML = productOpts;
    
    const activeSuppliers = suppliers.filter(s => !s.is_deleted);
    const supSel = document.getElementById('import-supplier-select');
    if(supSel) supSel.innerHTML = '<option value="">-- Chọn Nhà cung cấp --</option>' + activeSuppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    
    const activeCustomers = customers.filter(c => !c.is_deleted);
    const cusSel = document.getElementById('export-customer-select');
    if(cusSel) cusSel.innerHTML = '<option value="RETAIL">Khách hàng bán lẻ (Khách lẻ)</option>' + activeCustomers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// IMPORT CART & OPERATIONS
function addToImportCart() {
    const productId = document.getElementById('import-product-select').value;
    const qty = parseInt(document.getElementById('import-qty').value);
    let refNo = document.getElementById('import-ref-no').value.trim();
    
    if (!productId) return alert('Vui lòng chọn sản phẩm!');
    if (isNaN(qty) || qty <= 0) return alert('Số lượng phải lớn hơn 0!');
    
    if (!refNo) {
        const today = new Date().toISOString().split('T')[0];
        refNo = today;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check if item already in cart
    const existing = importCart.find(item => item.product_id === productId && item.ref_no === refNo);
    if (existing) {
        existing.qty += qty;
    } else {
        importCart.push({
            product_id: productId,
            name: product.name,
            ref_no: refNo,
            qty: qty
        });
    }
    
    document.getElementById('import-qty').value = 1;
    document.getElementById('import-ref-no').value = '';
    renderImportCart();
}

function removeFromImportCart(index) {
    importCart.splice(index, 1);
    renderImportCart();
}

function renderImportCart() {
    const tbody = document.getElementById('import-cart-body');
    if (!tbody) return;
    
    if (importCart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center" style="color:gray">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = importCart.map((item, idx) => `
        <tr>
            <td><b>${item.product_id}</b></td>
            <td>${item.name}</td>
            <td>${item.ref_no}</td>
            <td class="text-right">${item.qty}</td>
            <td><button class="btn-action-small danger" onclick="removeFromImportCart(${idx})">×</button></td>
        </tr>
    `).join('');
}

function createImportTicket() {
    const supplierId = document.getElementById('import-supplier-select').value;
    const ticketDate = document.getElementById('import-ticket-date').value.replace('T', ' ');
    const note = document.getElementById('import-ticket-note').value;
    
    if (!supplierId) return alert('Vui lòng chọn Nhà cung cấp!');
    if (importCart.length === 0) return alert('Giỏ hàng trống! Vui lòng thêm sản phẩm.');
    
    const ticketId = "IMP-" + Date.now();
    const today = new Date().toISOString().split('T')[0];
    
    // Update inventory stock and batches
    importCart.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (product) {
            if (!product.batches) product.batches = [];
            const existingBatch = product.batches.find(b => b.ref_no === item.ref_no);
            if (existingBatch) {
                existingBatch.qty += item.qty;
            } else {
                product.batches.push({
                    ref_no: item.ref_no,
                    import_date: ticketDate.split(' ')[0] || today,
                    qty: item.qty
                });
            }
            product.stock = getProductStock(product);
        }
    });
    
    // Save ticket
    inventory_tickets.push({
        id: ticketId,
        date: ticketDate || new Date().toISOString().replace('T', ' ').split('.')[0],
        type: 'import',
        partner_id: supplierId,
        note: note,
        items: importCart.map(item => ({
            product_id: item.product_id,
            ref_no: item.ref_no,
            qty: item.qty
        }))
    });
    
    // Clear cart and form
    importCart = [];
    document.getElementById('import-ticket-note').value = '';
    renderImportCart();
    initData();
    alert('Nhập kho thành công!');
}

// EXPORT CART & OPERATIONS
function addToExportCart() {
    const productId = document.getElementById('export-product-select').value;
    const qty = parseInt(document.getElementById('export-qty').value);
    
    if (!productId) return alert('Vui lòng chọn sản phẩm!');
    if (isNaN(qty) || qty <= 0) return alert('Số lượng phải lớn hơn 0!');
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Calculate total already in export cart for this product
    const alreadyInCart = exportCart.filter(item => item.product_id === productId).reduce((sum, item) => sum + item.qty, 0);
    const availableStock = getProductStock(product);
    
    if (availableStock < (alreadyInCart + qty)) {
        return alert(`Tồn kho không đủ! (Tồn hiện tại: ${availableStock}, Trong giỏ: ${alreadyInCart}, Thêm mới: ${qty})`);
    }
    
    const existing = exportCart.find(item => item.product_id === productId);
    if (existing) {
        existing.qty += qty;
    } else {
        exportCart.push({
            product_id: productId,
            name: product.name,
            qty: qty
        });
    }
    
    document.getElementById('export-qty').value = 1;
    renderExportCart();
}

function removeFromExportCart(index) {
    exportCart.splice(index, 1);
    renderExportCart();
}

function renderExportCart() {
    const tbody = document.getElementById('export-cart-body');
    if (!tbody) return;
    
    if (exportCart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center" style="color:gray">Chưa có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = exportCart.map((item, idx) => `
        <tr>
            <td><b>${item.product_id}</b></td>
            <td>${item.name}</td>
            <td class="text-right">${item.qty}</td>
            <td><button class="btn-action-small danger" onclick="removeFromExportCart(${idx})">×</button></td>
        </tr>
    `).join('');
}

function createExportTicket() {
    const customerId = document.getElementById('export-customer-select').value;
    const ticketDate = document.getElementById('export-ticket-date').value.replace('T', ' ');
    const note = document.getElementById('export-ticket-note').value;
    
    if (!customerId) return alert('Vui lòng chọn Khách hàng!');
    if (exportCart.length === 0) return alert('Giỏ hàng trống! Vui lòng thêm sản phẩm.');
    
    // Validate final stocks before deduction (sanity check)
    for (let item of exportCart) {
        const product = products.find(p => p.id === item.product_id);
        if (getProductStock(product) < item.qty) {
            return alert(`Sản phẩm ${product.name} đã bị thay đổi tồn kho và hiện tại không đủ số lượng để xuất!`);
        }
    }
    
    const ticketId = "EXP-" + Date.now();
    const ticketItems = [];
    
    // Process FIFO Deduction
    exportCart.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        let rem = item.qty;
        
        if (product.batches) {
            product.batches.sort((a,b) => new Date(a.import_date) - new Date(b.import_date));
            for (let i = 0; i < product.batches.length; i++) {
                if (rem === 0) break;
                const b = product.batches[i];
                if (b.qty > 0) {
                    const deduct = Math.min(b.qty, rem);
                    b.qty -= deduct;
                    rem -= deduct;
                    
                    ticketItems.push({
                        product_id: product.id,
                        ref_no: b.ref_no || b.import_date,
                        qty: deduct
                    });
                }
            }
            product.batches = product.batches.filter(b => b.qty > 0);
        }
        product.stock = getProductStock(product);
    });
    
    // Save ticket
    inventory_tickets.push({
        id: ticketId,
        date: ticketDate || new Date().toISOString().replace('T', ' ').split('.')[0],
        type: 'export',
        partner_id: customerId,
        note: note,
        items: ticketItems
    });
    
    // Clear
    exportCart = [];
    document.getElementById('export-ticket-note').value = '';
    renderExportCart();
    initData();
    alert('Xuất kho thành công!');
}

// HISTORY RENDER & OPERATIONS
function renderInventoryTickets() {
    const importHistoryBody = document.getElementById('import-history-body');
    const exportHistoryBody = document.getElementById('export-history-body');
    
    const importKw = document.getElementById('search-import-history') ? document.getElementById('search-import-history').value.toLowerCase().trim() : '';
    const exportKw = document.getElementById('search-export-history') ? document.getElementById('search-export-history').value.toLowerCase().trim() : '';
    
    const imports = inventory_tickets.filter(t => t.type === 'import');
    const exports = inventory_tickets.filter(t => t.type === 'export');
    
    if (importHistoryBody) {
        const filteredImports = imports.filter(t => {
            const sup = suppliers.find(s => s.id === t.partner_id);
            const supName = sup ? sup.name.toLowerCase() : '';
            return t.id.toLowerCase().includes(importKw) || supName.includes(importKw);
        });
        
        importHistoryBody.innerHTML = filteredImports.map(t => {
            const sup = suppliers.find(s => s.id === t.partner_id);
            const partnerText = sup ? sup.name : t.partner_id;
            
            const detailRowsHtml = `
                <div class="ticket-detail-container">
                    <h5 style="margin-bottom:8px; color:var(--primary-color); font-size:13px;">Chi tiết mặt hàng nhập:</h5>
                    <table class="ticket-detail-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Sản phẩm</th>
                                <th>Mã Lô</th>
                                <th class="text-right">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${t.items.map(it => {
                                const p = products.find(prod => prod.id === it.product_id);
                                return `
                                    <tr>
                                        <td><b>${it.product_id}</b></td>
                                        <td>${p ? p.name : 'Sản phẩm không rõ'}</td>
                                        <td>${it.ref_no || ''}</td>
                                        <td class="text-right">${it.qty}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    ${t.note ? `<p style="margin-top:10px; font-size:13px;"><b>Ghi chú:</b> ${t.note}</p>` : ''}
                </div>
            `;
            
            return `
                <tr class="accordion-toggle" onclick="toggleTicketDetails('${t.id}')">
                    <td><b>${t.id}</b></td>
                    <td>${t.date}</td>
                    <td>${partnerText}</td>
                    <td class="text-right">${t.items.length} mặt hàng</td>
                    <td>
                        <button class="btn-action-small danger" onclick="event.stopPropagation(); deleteTicket('${t.id}')">Hủy</button>
                    </td>
                </tr>
                <tr id="detail-${t.id}" class="ticket-detail-row" style="display:none;">
                    <td colspan="5">${detailRowsHtml}</td>
                </tr>
            `;
        }).reverse().join('');
    }
    
    if (exportHistoryBody) {
        const filteredExports = exports.filter(t => {
            const cus = customers.find(c => c.id === t.partner_id);
            const cusName = cus ? cus.name.toLowerCase() : '';
            return t.id.toLowerCase().includes(exportKw) || cusName.includes(exportKw);
        });
        
        exportHistoryBody.innerHTML = filteredExports.map(t => {
            const cus = customers.find(c => c.id === t.partner_id);
            const partnerText = cus ? cus.name : (t.partner_id === 'RETAIL' ? 'Khách hàng lẻ' : t.partner_id);
            
            const detailRowsHtml = `
                <div class="ticket-detail-container">
                    <h5 style="margin-bottom:8px; color:var(--status-chogiao-text); font-size:13px;">Chi tiết mặt hàng xuất:</h5>
                    <table class="ticket-detail-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Sản phẩm</th>
                                <th>Mã Lô xuất</th>
                                <th class="text-right">Số lượng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${t.items.map(it => {
                                const p = products.find(prod => prod.id === it.product_id);
                                return `
                                    <tr>
                                        <td><b>${it.product_id}</b></td>
                                        <td>${p ? p.name : 'Sản phẩm không rõ'}</td>
                                        <td>${it.ref_no || ''}</td>
                                        <td class="text-right">${it.qty}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                    ${t.note ? `<p style="margin-top:10px; font-size:13px;"><b>Ghi chú:</b> ${t.note}</p>` : ''}
                </div>
            `;
            
            return `
                <tr class="accordion-toggle" onclick="toggleTicketDetails('${t.id}')">
                    <td><b>${t.id}</b></td>
                    <td>${t.date}</td>
                    <td>${partnerText}</td>
                    <td class="text-right">${t.items.length} mặt hàng</td>
                    <td>
                        <button class="btn-action-small secondary" onclick="event.stopPropagation(); exportDeliveryPDF('${t.id}')">In</button>
                        <button class="btn-action-small danger" style="margin-left:4px;" onclick="event.stopPropagation(); deleteTicket('${t.id}')">Hủy</button>
                    </td>
                </tr>
                <tr id="detail-${t.id}" class="ticket-detail-row" style="display:none;">
                    <td colspan="5">${detailRowsHtml}</td>
                </tr>
            `;
        }).reverse().join('');
    }
}

function toggleTicketDetails(ticketId) {
    const detailRow = document.getElementById(`detail-${ticketId}`);
    if (detailRow) {
        detailRow.style.display = detailRow.style.display === 'none' ? 'table-row' : 'none';
    }
}

function deleteTicket(ticketId) {
    const t = inventory_tickets.find(x => x.id === ticketId);
    if (!t) return;
    
    if (!confirm(`Bạn có chắc chắn muốn HỦY phiếu kho ${ticketId}? Tồn kho và các lô hàng sẽ được hoàn tác tương ứng.`)) return;
    
    if (t.type === 'import') {
        // Revert imports (subtract quantities from batches)
        t.items.forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            if (product && product.batches) {
                const batchIndex = product.batches.findIndex(b => b.ref_no === item.ref_no);
                if (batchIndex !== -1) {
                    product.batches[batchIndex].qty -= item.qty;
                    if (product.batches[batchIndex].qty <= 0) {
                        product.batches.splice(batchIndex, 1);
                    }
                } else if (product.batches.length > 0) {
                    // Fallback: subtract from latest batch
                    product.batches[product.batches.length - 1].qty -= item.qty;
                    if (product.batches[product.batches.length - 1].qty <= 0) {
                        product.batches.pop();
                    }
                }
                product.stock = getProductStock(product);
            }
        });
    } else if (t.type === 'export') {
        // Revert exports (return quantities to batches)
        t.items.forEach(item => {
            const product = products.find(p => p.id === item.product_id);
            if (product) {
                if (!product.batches) product.batches = [];
                const today = new Date().toISOString().split('T')[0];
                product.batches.push({
                    ref_no: item.ref_no || "Hoàn trả",
                    import_date: today,
                    qty: item.qty
                });
                product.stock = getProductStock(product);
            }
        });
    }
    
    // Remove ticket
    inventory_tickets = inventory_tickets.filter(x => x.id !== ticketId);
    initData();
    alert('Hủy phiếu kho và hoàn tác tồn kho thành công!');
}

function exportXntToCSV() {
    const fromVal = document.getElementById('xnt-date-from') ? document.getElementById('xnt-date-from').value : '';
    const toVal = document.getElementById('xnt-date-to') ? document.getElementById('xnt-date-to').value : '';
    
    const rows = products.map(p => {
        let openingStock = p.stock;
        let imported = 0;
        let exported = 0;
        let closingStock = p.stock;
        
        const fromDate = fromVal ? new Date(fromVal + 'T00:00:00') : null;
        const toDate = toVal ? new Date(toVal + 'T23:59:59') : null;
        
        if (fromDate || toDate) {
            if (fromDate) {
                openingStock = getStockAtDate(p.id, fromVal + 'T00:00:00');
            } else {
                openingStock = 0;
            }
            
            inventory_tickets.forEach(ticket => {
                const ticketDate = new Date(ticket.date);
                let inRange = true;
                if (fromDate && ticketDate < fromDate) inRange = false;
                if (toDate && ticketDate > toDate) inRange = false;
                
                if (inRange) {
                    ticket.items.forEach(item => {
                        if (item.product_id === p.id) {
                            if (ticket.type === 'import') imported += item.qty;
                            if (ticket.type === 'export') exported += item.qty;
                        }
                    });
                }
            });
            
            closingStock = openingStock + imported - exported;
        } else {
            inventory_tickets.forEach(ticket => {
                ticket.items.forEach(item => {
                    if (item.product_id === p.id) {
                        if (ticket.type === 'import') imported += item.qty;
                        if (ticket.type === 'export') exported += item.qty;
                    }
                });
            });
            openingStock = closingStock - imported + exported;
        }
        
        let statusStr = "An toàn";
        if (closingStock <= 0) statusStr = "Hết hàng";
        else if (closingStock < p.safe_stock_level) statusStr = "Dưới định mức";
        else if (closingStock <= p.safe_stock_level * 1.2) statusStr = "Cảnh báo";
        
        return {
            "SKU": p.id,
            "Sản phẩm": p.name,
            "Đơn vị tính": p.unit || 'Cái',
            "Tồn đầu kỳ": openingStock,
            "Nhập trong kỳ": imported,
            "Xuất trong kỳ": exported,
            "Tồn cuối kỳ": closingStock,
            "Mức định mức": p.safe_stock_level || 0,
            "Trạng thái": statusStr
        };
    });
    
    const rangeStr = (fromVal && toVal) ? `${fromVal}_den_${toVal}` : 'TatCa';
    exportToCSV(rows, `BaoCao_XuatNhapTon_${rangeStr}.csv`);
}


// --- MODULE: CRM ---
function renderCRM(filteredCus = customers, filteredSup = suppliers) {
    const cTbody = document.getElementById('crm-customers-body');
    if(cTbody) {
        cTbody.innerHTML = filteredCus.map(c => {
            const contacts = c.contacts ? c.contacts.map(ct => `<b>${ct.name}</b> (${ct.role})<br>${ct.phone}`).join('<br><br>') : '';
            const rowStyle = c.is_deleted ? 'color: var(--text-muted); background: rgba(0,0,0,0.05);' : '';
            let actionBtns = c.is_deleted 
                ? `<button class="btn-primary" style="padding:4px 8px; font-size:11px; background:gray; width:auto;" onclick="event.stopPropagation(); restoreItem('customers', '${c.id}')">Khôi phục</button>
                   <button class="btn-primary" style="padding:4px 8px; font-size:11px; background:red; margin-top:4px; width:auto;" onclick="event.stopPropagation(); hardDeleteItem('customers', '${c.id}')">Xóa vĩnh viễn</button>`
                : `<button class="btn-primary" style="padding:4px 8px; font-size:11px; width:auto;" onclick="event.stopPropagation(); editPartner('CUS', '${c.id}')">Sửa</button>
                   <button class="btn-primary" style="padding:4px 8px; font-size:11px; background:var(--status-chogiao-text); margin-top:4px; width:auto;" onclick="event.stopPropagation(); softDeleteItem('customers', '${c.id}')">Xóa</button>`;
            return `<tr style="${rowStyle}" class="clickable" onclick="openCustomerDetail('${c.id}')"><td>${c.id}</td><td>${c.name} ${c.is_deleted?'<i>(Đã xóa)</i>':''}<br><i style="font-size:12px;color:gray">${c.industry||''}</i></td><td style="font-size: 12px;">${contacts}</td><td>${c.phone}</td><td>${(c.debt_limit||0).toLocaleString()} VNĐ</td><td>${actionBtns}</td></tr>`;
        }).join('');
    }
    
    const sTbody = document.getElementById('crm-suppliers-body');
    if(sTbody) {
        sTbody.innerHTML = filteredSup.map(s => {
            const contacts = s.contacts ? s.contacts.map(ct => `<b>${ct.name}</b> (${ct.role})<br>${ct.phone}`).join('<br><br>') : '';
            const rowStyle = s.is_deleted ? 'color: var(--text-muted); background: rgba(0,0,0,0.05);' : '';
            let actionBtns = s.is_deleted 
                ? `<button class="btn-primary" style="padding:4px 8px; font-size:11px; background:gray; width:auto;" onclick="restoreItem('suppliers', '${s.id}')">Khôi phục</button>
                   <button class="btn-primary" style="padding:4px 8px; font-size:11px; background:red; margin-top:4px; width:auto;" onclick="hardDeleteItem('suppliers', '${s.id}')">Xóa vĩnh viễn</button>`
                : `<button class="btn-primary" style="padding:4px 8px; font-size:11px; width:auto;" onclick="editPartner('SUP', '${s.id}')">Sửa</button>
                   <button class="btn-primary" style="padding:4px 8px; font-size:11px; background:var(--status-chogiao-text); margin-top:4px; width:auto;" onclick="softDeleteItem('suppliers', '${s.id}')">Xóa</button>`;
            return `<tr style="${rowStyle}"><td>${s.id}</td><td>${s.name} ${s.is_deleted?'<i>(Đã xóa)</i>':''}<br><i style="font-size:12px;color:gray">${s.industry||''}</i></td><td style="font-size: 12px;">${contacts}</td><td>${s.phone}</td><td>${s.address}</td><td>${actionBtns}</td></tr>`;
        }).join('');
    }
}


// --- MODULE: FINANCE ---
function createCashflow() {
    const type = document.getElementById('cf-type').value;
    const amount = parseInt(document.getElementById('cf-amount').value);
    const ref = document.getElementById('cf-ref').value;
    const note = document.getElementById('cf-note').value;
    
    if(isNaN(amount) || amount <= 0) return alert('Số tiền không hợp lệ!');
    
    cashflow.push({
        id: "CF-" + Date.now(),
        date: new Date().toISOString().split('T')[0],
        type, amount, reference_id: ref, note
    });
    
    initData();
    alert('Thêm giao dịch thành công!');
}

function renderFinance() {
    let totalIn = 0;
    let totalOut = 0;

    const cfTbody = document.getElementById('finance-cashflow-body');
    if(cfTbody) {
        cfTbody.innerHTML = cashflow.map(c => {
            if(c.type === 'in') totalIn += c.amount;
            if(c.type === 'out') totalOut += c.amount;
            return `<tr><td>${c.date}</td><td>${c.type==='in'?'<span style="color:green;font-weight:bold">Thu</span>':'<span style="color:red;font-weight:bold">Chi</span>'}</td><td>${c.amount.toLocaleString()}</td><td>${c.reference_id}</td><td>${c.note}</td></tr>`;
        }).reverse().join('');
    }
    
    // Calculate Receivables
    let totalReceivable = 0;
    const recTbody = document.getElementById('finance-receivable-body');
    if(recTbody) {
        recTbody.innerHTML = contracts.map(ct => {
            const customer = customers.find(c => c.id === ct.customer_id);
            const paid = cashflow.filter(cf => cf.type === 'in' && cf.reference_id === ct.id).reduce((sum, cf) => sum + cf.amount, 0);
            const remaining = ct.total_amount - paid;
            if(remaining > 0) totalReceivable += remaining;
            return `<tr><td>${customer?customer.name:ct.customer_id}</td><td>${ct.id}</td><td>${ct.total_amount.toLocaleString()}</td><td style="color:green">${paid.toLocaleString()}</td><td style="${remaining>0?'color:red;font-weight:bold;':''}">${remaining.toLocaleString()}</td></tr>`;
        }).join('');
    }

    // Update Dashboard
    const elIn = document.getElementById('dash-total-in');
    const elOut = document.getElementById('dash-total-out');
    const elBal = document.getElementById('dash-balance');
    const elRec = document.getElementById('dash-receivable');

    if(elIn) elIn.innerText = totalIn.toLocaleString() + ' đ';
    if(elOut) elOut.innerText = totalOut.toLocaleString() + ' đ';
    if(elBal) {
        const bal = totalIn - totalOut;
        elBal.innerText = bal.toLocaleString() + ' đ';
        elBal.style.color = bal < 0 ? 'red' : 'var(--primary-color)';
    }
    if(elRec) elRec.innerText = totalReceivable.toLocaleString() + ' đ';
}


// --- MODULE: HR ---
function renderHR() {
    const hrTbody = document.getElementById('hr-employees-body');
    if(hrTbody) {
        hrTbody.innerHTML = employees.map(e => {
            const projs = e.projects ? e.projects.join('<br>') : '';
            return `<tr><td>${e.id}</td><td>${e.name}</td><td>${e.role}</td><td>${e.kpi_target.toLocaleString()}</td><td style="color:var(--primary-color)">${e.kpi_achieved.toLocaleString()}</td><td>${projs}</td></tr>`;
        }).join('');
    }
}


// --- MODULE: SALES & QUOTING ---
let quoteCart = [];

function renderSalesProducts(productArray) {
    const spTbody = document.getElementById('sales-product-table-body');
    if(spTbody) {
        spTbody.innerHTML = productArray.map(p => {
            const specStr = p.specs ? `CS: ${p.specs.power}<br>Loại: ${p.specs.component_type}` : '';
            return `<tr class="clickable">
                <td onclick="openPricingCalc('${p.id}')">${p.id}</td>
                <td onclick="openPricingCalc('${p.id}')">${p.name}</td>
                <td onclick="openPricingCalc('${p.id}')" style="font-size:12px">${specStr}</td>
                <td onclick="openPriceHistory('${p.id}')" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">${p.price_out.toLocaleString()}</td>
                <td onclick="openPricingCalc('${p.id}')">${p.stock}</td>
            </tr>`;
        }).join('');
    }
}


function renderQuoteCart() {
    const container = document.getElementById('quote-items');
    if(!container) return;
    
    if(quoteCart.length === 0) {
        container.innerHTML = '<p class="text-center" style="color:gray">Chưa chọn sản phẩm</p>';
        document.getElementById('quote-total-price').innerText = '0 VNĐ';
        return;
    }
    
    container.innerHTML = quoteCart.map(item => `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; padding-bottom:10px; border-bottom:1px solid var(--border-color);">
            <div><b>${item.name}</b><br><span style="font-size:12px; color:gray">${item.price.toLocaleString()} x ${item.qty}</span></div>
            <div style="font-weight:bold">${(item.price * item.qty).toLocaleString()}</div>
        </div>
    `).join('');
    
    const total = quoteCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    document.getElementById('quote-total-price').innerText = total.toLocaleString() + ' VNĐ';
}

function createQuote() {
    const cusId = document.getElementById('quote-customer-select').value;
    if(!cusId || quoteCart.length === 0) return alert('Vui lòng chọn Khách hàng và Sản phẩm!');
    
    const total = quoteCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    quotes.push({
        id: "QT-" + Date.now(),
        date: new Date().toISOString().split('T')[0],
        customer_id: cusId,
        status: "Chờ duyệt",
        total_amount: total,
        items: [...quoteCart]
    });
    
    quoteCart = [];
    renderQuoteCart();
    initData();
    alert('Tạo Báo giá thành công!');
}

function renderSales(filteredQuotes = quotes, filteredContracts = contracts) {
    const activeCustomers = customers.filter(c => !c.is_deleted);
    const cusSel = document.getElementById('quote-customer-select');
    if(cusSel) cusSel.innerHTML = '<option value="">-- Chọn Khách hàng --</option>' + activeCustomers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    const qTbody = document.getElementById('quotes-table-body');
    if(qTbody) {
        qTbody.innerHTML = filteredQuotes.map(q => {
            const cus = customers.find(c => c.id === q.customer_id);
            let infoBtn = q.items && q.items.some(item => item.pricing_details) 
                ? `<button class="btn-primary" style="padding:4px 8px; font-size:11px; width:auto; background:var(--primary-color); margin-right:5px;" onclick="viewQuotePricing('${q.id}')">Tính giá</button>` : '';
            let printBtn = `<button class="btn-primary" style="padding:4px 8px; font-size:11px; width:auto; background:gray; margin-right:5px;" onclick="exportQuotePDF('${q.id}')">In PDF</button>`;
            let btn = q.status === 'Chờ duyệt' ? `<button class="btn-primary" style="padding:4px 8px; font-size:11px; width:auto;" onclick="approveQuote('${q.id}')">Duyệt & Tạo HĐ</button>` : '';
            return `<tr><td>${q.id} <button class="btn-icon" onclick="openInternalQuoteNote('${q.id}')" style="margin-left:5px; border-radius:50%; width:20px; height:20px; font-size:12px; background:#f59e0b; color:white; border:none; cursor:pointer; display:inline-flex; align-items:center; justify-content:center;" title="Ghi chú nội bộ">i</button></td><td>${q.date}</td><td>${cus?cus.name:q.customer_id}</td><td>${q.total_amount.toLocaleString()}</td><td><span class="status-badge ${q.status==='Đã duyệt'?'status-daban':'status-baogia'}">${q.status}</span></td><td>${printBtn}${infoBtn}${btn}</td></tr>`;
        }).reverse().join('');
    }
    
    const ctTbody = document.getElementById('contracts-table-body');
    if(ctTbody) {
        ctTbody.innerHTML = filteredContracts.map(ct => {
            const cus = customers.find(c => c.id === ct.customer_id);
            const mStone = ct.milestones ? ct.milestones.map(m => `${m.name}: <span style="color:${m.paid?'green':'red'}">${m.paid?'Đã TT':'Chưa TT'}</span>`).join('<br>') : '';
            let exportBtn = `<button class="btn-primary" style="padding:4px 8px; font-size:11px; width:auto; background:var(--status-chogiao-text); margin-top:5px;" onclick="handleSmartExport('${ct.id}')">Xuất kho tự động</button>`;
            return `<tr><td>${ct.id}<br>${exportBtn}</td><td>${ct.quote_id}</td><td>${ct.date}</td><td>${cus?cus.name:ct.customer_id}</td><td style="font-weight:bold">${ct.total_amount.toLocaleString()}</td><td style="font-size: 12px; line-height:1.4">${mStone}</td></tr>`;
        }).reverse().join('');
    }
}

function handleSmartExport(contractId) {
    if(!confirm("Hệ thống sẽ tự động trừ kho dựa trên Báo giá của hợp đồng này. Bạn có chắc chắn?")) return;
    
    const ct = contracts.find(x => x.id === contractId);
    if(!ct) return alert("Không tìm thấy hợp đồng!");
    
    const q = quotes.find(x => x.id === ct.quote_id);
    if(!q || !q.items) return alert("Không tìm thấy chi tiết báo giá cho hợp đồng này!");
    
    let successCount = 0;
    const today = new Date().toISOString().replace('T', ' ').split('.')[0];
    
    const ticketId = "EXP-" + Date.now();
    const ticketItems = [];
    
    for (let item of q.items) {
        const product = products.find(p => p.id === item.product_id);
        if(!product) continue;
        
        let qtyToExport = item.qty;
        if(getProductStock(product) < qtyToExport) {
            alert(`Sản phẩm ${product.name} không đủ tồn kho để xuất!`);
            return;
        }
        
        // FIFO Export
        if(product.batches) {
            product.batches.sort((a,b) => new Date(a.import_date) - new Date(b.import_date));
            for(let i=0; i<product.batches.length; i++) {
                if(qtyToExport === 0) break;
                const b = product.batches[i];
                if(b.qty > 0) {
                    const deduct = Math.min(b.qty, qtyToExport);
                    b.qty -= deduct;
                    qtyToExport -= deduct;
                    ticketItems.push({
                        product_id: product.id,
                        ref_no: b.ref_no || b.import_date,
                        qty: deduct
                    });
                }
            }
            product.batches = product.batches.filter(b => b.qty > 0);
            product.stock = getProductStock(product);
            successCount++;
        }
    }
    
    if(ticketItems.length > 0) {
        inventory_tickets.push({
            id: ticketId,
            date: today,
            type: 'export',
            partner_id: ct.customer_id,
            note: `Xuất tự động từ HĐ ${contractId}`,
            items: ticketItems
        });
        alert("Xuất kho tự động thành công!");
        initData();
    } else {
        alert("Không có sản phẩm nào được xuất!");
    }
}

function viewQuotePricing(qId) {
    const q = quotes.find(x => x.id === qId);
    if(!q) return;
    
    let html = `<h4>Báo giá: ${q.id}</h4><hr style="margin:10px 0; border-color:var(--border-color);">`;
    
    q.items.forEach(item => {
        if(!item.pricing_details) return;
        const pd = item.pricing_details;
        const bd = pd.breakdown;
        
        let dynHtml = bd.dynamicCosts.map(d => `<li>+ ${d.name}: ${d.amount.toLocaleString()}</li>`).join('');
        
        html += `
        <div style="margin-bottom: 20px; background: rgba(99, 102, 241, 0.05); padding: 15px; border-radius: 8px;">
            <h5 style="color:var(--primary-color); margin-bottom:10px; font-size:16px;">Sản phẩm: ${item.name}</h5>
            <ul style="list-style:none; padding:0; font-size: 14px; line-height: 1.8;">
                <li><b>1. Giá nhập:</b> ${bd.pin.toLocaleString()}</li>
                <li><b>2. Vận hành:</b> ${bd.op.toLocaleString()}</li>
                <li><b>3. Vận chuyển:</b> ${bd.ship.toLocaleString()}</li>
                <li><b>4. Chi phí khác:</b><ul style="margin-left: 15px; font-style: italic;">${dynHtml}</ul></li>
                <li style="border-top:1px dashed var(--border-color); margin-top:5px; padding-top:5px;"><b>TỔNG CHI PHÍ GỐC:</b> ${pd.baseCost.toLocaleString()}</li>
                <li><b>5. Lợi nhuận kỳ vọng:</b> ${pd.margin}% (${pd.profit.toLocaleString()})</li>
                <li><b>6. Thuế suất:</b> ${pd.taxPercent}% (${pd.taxType === 'profit' ? 'Trên Lợi nhuận' : 'Trên Doanh thu'}) -> <b>Tiền thuế: ${pd.taxValue.toLocaleString()}</b></li>
                <li style="border-top:1px solid var(--border-color); margin-top:10px; padding-top:10px; font-weight:bold; color:var(--status-daban-text); font-size:18px;">GIÁ BÁN CUỐI CÙNG: ${pd.finalPrice.toLocaleString()} VNĐ</li>
            </ul>
        </div>
        `;
    });
    
    document.getElementById('note-modal').querySelector('.modal-header h3').innerText = "Lịch sử Tính Giá";
    document.getElementById('note-content').innerHTML = html;
    document.getElementById('note-modal').style.display = 'flex';
}

function approveQuote(qId) {
    const quote = quotes.find(q => q.id === qId);
    if(quote) {
        quote.status = 'Đã duyệt';
        const ctId = 'HD-' + Date.now();
        contracts.push({
            id: ctId, quote_id: quote.id, date: new Date().toISOString().split('T')[0], customer_id: quote.customer_id, total_amount: quote.total_amount, status: 'Đang thực hiện',
            milestones: [{name: "Tạm ứng 50%", amount: quote.total_amount*0.5, paid: false}, {name: "Giao hàng 50%", amount: quote.total_amount*0.5, paid: false}]
        });
        alert('Đã duyệt Báo giá và Tự động tạo Hợp đồng: ' + ctId);
        initData();
    }
}


// --- SYSTEM ---
function exportDatabase() {
    let jsContent = `let products = ${JSON.stringify(products, null, 4)};\n\n`;
    jsContent += `let customers = ${JSON.stringify(customers, null, 4)};\n\n`;
    jsContent += `let suppliers = ${JSON.stringify(suppliers, null, 4)};\n\n`;
    jsContent += `let quotes = ${JSON.stringify(quotes, null, 4)};\n\n`;
    jsContent += `let contracts = ${JSON.stringify(contracts, null, 4)};\n\n`;
    jsContent += `let cashflow = ${JSON.stringify(cashflow, null, 4)};\n\n`;
    jsContent += `let employees = ${JSON.stringify(employees, null, 4)};\n\n`;
    jsContent += `let inventory_tickets = ${JSON.stringify(inventory_tickets, null, 4)};\n`;

    const blob = new Blob([jsContent], { type: 'application/javascript;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.js');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function exportToCSV(dataArray, filename) {
    if (!dataArray || !dataArray.length) return alert("Không có dữ liệu!");
    const separator = ',';
    const keys = Object.keys(dataArray[0]);
    const csvContent = [keys.join(separator)];
    dataArray.forEach(item => {
        const row = keys.map(k => {
            let cell = typeof item[k] === 'object' ? JSON.stringify(item[k]) : (item[k]||'');
            cell = cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) cell = `"${cell}"`;
            return cell;
        }).join(separator);
        csvContent.push(row);
    });
    const blob = new Blob(["\uFEFF" + csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', filename);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
}

// --- MODALS & CRUD ---
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function openInternalQuoteNote(qId) {
    const q = quotes.find(x => x.id === qId);
    if(!q) return;
    document.getElementById('internal-note-quote-id').value = q.id;
    document.getElementById('internal-quote-note-text').value = q.internal_note || '';
    document.getElementById('modal-internal-quote-note').style.display = 'flex';
}

function saveInternalQuoteNote() {
    const qId = document.getElementById('internal-note-quote-id').value;
    const text = document.getElementById('internal-quote-note-text').value;
    const q = quotes.find(x => x.id === qId);
    if(q) {
        q.internal_note = text;
        initData(); // Re-render if needed, though not strictly required since it's hidden
    }
    closeModal('modal-internal-quote-note');
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// 1. SKU
function showCreateSKUModal() {
    document.getElementById('modal-create-sku').style.display = 'flex';
}

function saveNewSKU() {
    const id = document.getElementById('new-sku-id').value;
    const name = document.getElementById('new-sku-name').value;
    const price_in = parseInt(document.getElementById('new-sku-price_in').value);
    const price_out = parseInt(document.getElementById('new-sku-price_out').value);
    const unit = document.getElementById('new-sku-unit').value;
    const safe_stock = parseInt(document.getElementById('new-sku-safe_stock').value);
    const power = document.getElementById('new-sku-spec-power').value || 'N/A';
    const type = document.getElementById('new-sku-spec-type').value || 'N/A';
    
    if(!id || !name || isNaN(price_in)) return alert("Vui lòng điền đủ mã, tên và giá nhập!");
    
    const existingP = products.find(p => p.id === id);
    if(existingP) {
        if(existingP.price_in !== price_in || existingP.price_out !== price_out) {
            if(!existingP.price_history) existingP.price_history = [];
            existingP.price_history.push({
                date: new Date().toISOString().split('T')[0],
                old_in: existingP.price_in, new_in: price_in,
                old_out: existingP.price_out, new_out: price_out
            });
        }
        
        existingP.name = name;
        existingP.price_in = price_in;
        existingP.price_out = price_out;
        existingP.unit = unit;
        existingP.safe_stock_level = safe_stock || 0;
        existingP.specs = { power, component_type: type, pipe_rows: "N/A" };
        alert("Cập nhật SKU thành công!");
    } else {
        products.push({
            id, name, price_in, price_out, unit, safe_stock_level: safe_stock || 0, stock: 0,
            specs: { power, component_type: type, pipe_rows: "N/A" }, batches: [], price_history: [], note: ""
        });
        alert("Thêm SKU thành công!");
    }
    
    closeModal('modal-create-sku');
    initData();
}

// 2. CRM Partners
function showCreateCustomerModal() {
    document.getElementById('modal-partner-title').innerText = "Thêm Khách hàng B2B";
    document.getElementById('new-partner-type').value = "CUS";
    // Reset fields
    resetPartnerFields();
    document.getElementById('modal-create-partner').style.display = 'flex';
}

function showCreateSupplierModal() {
    document.getElementById('modal-partner-title').innerText = "Thêm Nhà Cung Cấp";
    document.getElementById('new-partner-type').value = "SUP";
    // Reset fields
    resetPartnerFields();
    document.getElementById('modal-create-partner').style.display = 'flex';
}

function resetPartnerFields() {
    document.getElementById('new-partner-id').value = '';
    document.getElementById('new-partner-name').value = '';
    document.getElementById('new-partner-industry').value = '';
    document.getElementById('new-partner-phone').value = '';
    document.getElementById('new-partner-address').value = '';
    document.getElementById('contact-list-container').innerHTML = '';
    addContactRow(); // Add one initial empty row
}

function addContactRow(name = '', role = '', phone = '') {
    const container = document.getElementById('contact-list-container');
    const row = document.createElement('div');
    row.className = 'contact-row';
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.innerHTML = `
        <input type="text" class="input-control contact-name" placeholder="Tên" style="flex: 1; margin-bottom: 0;" value="${name}">
        <input type="text" class="input-control contact-role" placeholder="Chức vụ" style="flex: 1; margin-bottom: 0;" value="${role}">
        <input type="text" class="input-control contact-phone" placeholder="SĐT" style="flex: 1; margin-bottom: 0;" value="${phone}">
        <button class="btn-primary" style="background: var(--status-chogiao-text); width: auto; padding: 0 10px;" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(row);
}

function saveNewPartner() {
    const type = document.getElementById('new-partner-type').value;
    const id = document.getElementById('new-partner-id').value;
    const name = document.getElementById('new-partner-name').value;
    const industry = document.getElementById('new-partner-industry').value;
    const phone = document.getElementById('new-partner-phone').value;
    const address = document.getElementById('new-partner-address').value;
    
    if(!id || !name) return alert("Vui lòng điền đủ mã và tên!");
    
    const contactRows = document.querySelectorAll('.contact-row');
    const contactsList = [];
    contactRows.forEach(row => {
        const cName = row.querySelector('.contact-name').value;
        const cRole = row.querySelector('.contact-role').value;
        const cPhone = row.querySelector('.contact-phone').value;
        if(cName) contactsList.push({ name: cName, role: cRole, phone: cPhone });
    });
    
    let arr = type === 'CUS' ? customers : suppliers;
    let existingP = arr.find(p => p.id === id);
    
    if (existingP) {
        existingP.name = name;
        existingP.industry = industry;
        existingP.phone = phone;
        existingP.address = address;
        existingP.contacts = contactsList;
        alert("Cập nhật đối tác thành công!");
    } else {
        const partnerData = { id, name, industry, phone, address, contacts: contactsList };
        
        if(type === 'CUS') {
            partnerData.debt_limit = 0;
            partnerData.interaction_logs = [];
            customers.push(partnerData);
        } else {
            suppliers.push(partnerData);
        }
        alert("Thêm đối tác mới thành công!");
    }
    
    closeModal('modal-create-partner');
    initData();
}

// 3. CRM 360 View
function openCustomerDetail(id) {
    const c = customers.find(x => x.id === id);
    if(!c) return;
    
    let logsHtml = (c.interaction_logs || []).map(l => `<li><b>${l.date}</b> (${l.user}): ${l.note}</li>`).join('');
    const relatedContracts = contracts.filter(ct => ct.customer_id === id);
    let contractHtml = relatedContracts.map(ct => `<li>${ct.id} - ${ct.total_amount.toLocaleString()} VNĐ (${ct.status})</li>`).join('');
    
    const content = `
        <div style="display:flex; gap: 20px;">
            <div style="flex:1;">
                <h4 style="color:var(--primary-color)">Thông tin chung</h4>
                <p><b>Mã:</b> ${c.id}</p>
                <p><b>Tên:</b> ${c.name}</p>
                <p><b>Lĩnh vực:</b> ${c.industry || 'N/A'}</p>
                <p><b>SĐT:</b> ${c.phone}</p>
                <p><b>Địa chỉ:</b> ${c.address}</p>
                <h4 style="color:var(--primary-color); margin-top:10px;">Đơn hàng / Hợp đồng</h4>
                <ul style="line-height:1.6; font-size:14px;">${contractHtml || '<li>Chưa có Hợp đồng</li>'}</ul>
            </div>
            <div style="flex:1; border-left: 1px solid var(--border-color); padding-left:20px;">
                <h4 style="color:var(--primary-color)">Nhật ký Trao đổi</h4>
                <ul style="margin-bottom:10px; max-height: 200px; overflow-y:auto; font-size:14px; line-height:1.6;">
                    ${logsHtml || '<li>Chưa có trao đổi nào.</li>'}
                </ul>
                <textarea id="new-log-note" class="input-control" placeholder="Nội dung trao đổi mới..." rows="3"></textarea>
                <input type="text" id="new-log-user" class="input-control mt-4" placeholder="Người thực hiện (VD: Sales A)">
                <button class="btn-primary mt-4" onclick="addInteractionLog('${c.id}')" style="width:auto">Lưu Ghi chú</button>
            </div>
        </div>
    `;
    
    document.getElementById('crm-360-content').innerHTML = content;
    document.getElementById('modal-crm-360').style.display = 'flex';
}

function addInteractionLog(id) {
    const note = document.getElementById('new-log-note').value;
    const user = document.getElementById('new-log-user').value || 'Hệ thống';
    if(!note) return alert("Vui lòng nhập nội dung!");
    
    const c = customers.find(x => x.id === id);
    if(c) {
        if(!c.interaction_logs) c.interaction_logs = [];
        c.interaction_logs.push({
            date: new Date().toISOString().split('T')[0],
            user: user,
            note: note
        });
        openCustomerDetail(id);
        initData();
    }
}

// --- DYNAMIC COSTS ---
let dynamicCostsCount = 0;
function addDynamicCost() {
    dynamicCostsCount++;
    const div = document.createElement('div');
    div.id = 'dyn-cost-' + dynamicCostsCount;
    div.style.display = 'flex';
    div.style.gap = '10px';
    div.innerHTML = `
        <input type="text" class="input-control dyn-cost-name" placeholder="Tên chi phí" style="flex:2; margin-bottom:0;">
        <input type="number" class="input-control dyn-cost-val" placeholder="Số tiền" value="0" style="flex:1.5; margin-bottom:0;" oninput="calculatePrice()">
        <button class="btn-primary" style="background:red; width:auto; padding:0 10px;" onclick="document.getElementById('dyn-cost-${dynamicCostsCount}').remove(); calculatePrice();">X</button>
    `;
    document.getElementById('calc-dynamic-costs').appendChild(div);
}

function toggleTaxUnlock() {
    const isUnlocked = document.getElementById('calc-tax-unlock').checked;
    document.getElementById('calc-tax-value').disabled = !isUnlocked;
    calculatePrice();
}

// 4. Pricing Calculator for Quotes
function openPricingCalc(product_id) {
    const p = products.find(x => x.id === product_id);
    if(!p) return;
    
    document.getElementById('calc-item-index').value = product_id;
    document.getElementById('calc-price-in').value = p.price_in;
    document.getElementById('calc-cost-op').value = 0;
    document.getElementById('calc-cost-ship').value = 0;
    document.getElementById('calc-dynamic-costs').innerHTML = '';
    dynamicCostsCount = 0;
    document.getElementById('calc-profit-margin').value = 15;
    document.getElementById('calc-tax-percent').value = 20;
    document.getElementById('calc-tax-unlock').checked = false;
    document.getElementById('calc-tax-value').disabled = true;
    
    calculatePrice();
    document.getElementById('modal-pricing-calc').style.display = 'flex';
}

function calculatePrice(fromManualTax = false) {
    const pin = parseInt(document.getElementById('calc-price-in').value) || 0;
    const op = parseInt(document.getElementById('calc-cost-op').value) || 0;
    const ship = parseInt(document.getElementById('calc-cost-ship').value) || 0;
    
    let dynamicSum = 0;
    const dynCosts = [];
    document.querySelectorAll('.dyn-cost-val').forEach((el, index) => {
        const val = parseInt(el.value) || 0;
        dynamicSum += val;
        const nameEl = el.parentElement.querySelector('.dyn-cost-name');
        dynCosts.push({ name: nameEl.value || ('Chi phí ' + (index+1)), amount: val });
    });
    
    const margin = parseInt(document.getElementById('calc-profit-margin').value) || 0;
    const taxType = document.getElementById('calc-tax-type').value;
    const taxPercent = parseInt(document.getElementById('calc-tax-percent').value) || 0;
    const taxUnlocked = document.getElementById('calc-tax-unlock').checked;
    
    const baseCost = pin + op + ship + dynamicSum;
    const profit = baseCost * (margin / 100);
    const revBeforeTax = baseCost + profit;
    
    let taxValue = 0;
    if (taxUnlocked && fromManualTax) {
        taxValue = parseInt(document.getElementById('calc-tax-value').value) || 0;
    } else if (!taxUnlocked) {
        if(taxType === 'profit') taxValue = profit * (taxPercent / 100);
        else taxValue = revBeforeTax * (taxPercent / 100);
        document.getElementById('calc-tax-value').value = Math.round(taxValue);
    } else {
        taxValue = parseInt(document.getElementById('calc-tax-value').value) || 0;
    }
    
    const finalPrice = revBeforeTax + taxValue;
    
    document.getElementById('calc-final-price').innerText = Math.round(finalPrice).toLocaleString() + ' VNĐ';
    
    const state = {
        baseCost, profit, margin, taxValue, taxType, taxPercent, finalPrice,
        breakdown: { pin, op, ship, dynamicCosts: dynCosts }
    };
    document.getElementById('calc-final-price').setAttribute('data-state', JSON.stringify(state));
}

function saveCalculatedPrice() {
    const pId = document.getElementById('calc-item-index').value;
    const stateStr = document.getElementById('calc-final-price').getAttribute('data-state');
    if(!stateStr) return;
    const state = JSON.parse(stateStr);
    
    const p = products.find(x => x.id === pId);
    if(!p) return;
    const existing = quoteCart.find(x => x.product_id === p.id);
    if(existing) {
        existing.qty += 1;
        existing.price = state.finalPrice;
        existing.pricing_details = state;
    } else {
        quoteCart.push({ product_id: p.id, name: p.name, qty: 1, price: state.finalPrice, pricing_details: state });
    }
    
    closeModal('modal-pricing-calc');
    renderQuoteCart();
}

// --- CRUD SYSTEM (Soft & Hard Delete) ---
function softDeleteItem(type, id) {
    if(!confirm('Đưa mục này vào thùng rác? (Sẽ ẩn màu xám)')) return;
    let arr = window[type];
    if(!arr) return;
    const item = arr.find(x => x.id === id);
    if(item) {
        item.is_deleted = true;
        initData();
    }
}

function restoreItem(type, id) {
    let arr = window[type];
    const item = arr.find(x => x.id === id);
    if(item) {
        item.is_deleted = false;
        initData();
    }
}

function hardDeleteItem(type, id) {
    if(!confirm('XÓA VĨNH VIỄN? Bạn không thể khôi phục!')) return;
    window[type] = window[type].filter(x => x.id !== id);
    initData();
}

function editSKU(id) {
    const p = products.find(x => x.id === id);
    if(!p) return;
    document.getElementById('new-sku-id').value = p.id;
    // Set existing data
    document.getElementById('new-sku-name').value = p.name;
    document.getElementById('new-sku-price_in').value = p.price_in;
    document.getElementById('new-sku-price_out').value = p.price_out;
    document.getElementById('new-sku-unit').value = p.unit;
    document.getElementById('new-sku-safe_stock').value = p.safe_stock_level;
    document.getElementById('new-sku-spec-power').value = p.specs ? p.specs.power : '';
    document.getElementById('new-sku-spec-type').value = p.specs ? p.specs.component_type : '';
    showCreateSKUModal();
}

function editPartner(type, id) {
    let arr = type === 'CUS' ? customers : suppliers;
    const p = arr.find(x => x.id === id);
    if(!p) return;
    
    document.getElementById('new-partner-id').value = p.id;
    document.getElementById('new-partner-name').value = p.name;
    document.getElementById('new-partner-industry').value = p.industry || '';
    document.getElementById('new-partner-phone').value = p.phone;
    document.getElementById('new-partner-address').value = p.address;
    
    document.getElementById('contact-list-container').innerHTML = '';
    if(p.contacts && p.contacts.length > 0) {
        p.contacts.forEach(c => addContactRow(c.name, c.role, c.phone));
    } else {
        addContactRow();
    }
    
    document.getElementById('modal-partner-title').innerText = type === 'CUS' ? "Chỉnh sửa Khách hàng" : "Chỉnh sửa Nhà cung cấp";
    document.getElementById('new-partner-type').value = type;
    document.getElementById('modal-create-partner').style.display = 'flex';
}

// --- CSV IMPORT ---
function importCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        if (lines.length < 2) return alert("File CSV trống hoặc không đúng định dạng!");
        
        let headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
        
        let importedCount = 0;
        for (let i = 1; i < lines.length; i++) {
            if(!lines[i].trim()) continue;
            let row = lines[i].split(',');
            let obj = {};
            headers.forEach((h, index) => {
                obj[h] = row[index] ? row[index].trim().replace(/"/g, '') : '';
            });
            
            if(!obj['id'] || !obj['name']) continue;
            
            let p = products.find(x => x.id === obj['id']);
            if(!p) {
                p = {
                    id: obj['id'], name: obj['name'], 
                    price_in: parseInt(obj['price_in']) || 0,
                    price_out: parseInt(obj['price_out']) || 0,
                    unit: obj['unit'] || 'Cái',
                    safe_stock_level: parseInt(obj['safe_stock_level']) || 0,
                    stock: 0,
                    specs: { power: obj['power'] || 'N/A', component_type: obj['type'] || 'N/A', pipe_rows: "N/A" },
                    batches: [], price_history: [], note: ""
                };
                products.push(p);
            } else {
                p.name = obj['name'] || p.name;
                p.price_in = parseInt(obj['price_in']) || p.price_in;
                p.price_out = parseInt(obj['price_out']) || p.price_out;
                p.safe_stock_level = parseInt(obj['safe_stock_level']) || p.safe_stock_level;
                if(obj['unit']) p.unit = obj['unit'];
                if(p.specs) {
                    if(obj['power']) p.specs.power = obj['power'];
                    if(obj['type']) p.specs.component_type = obj['type'];
                }
            }
            importedCount++;
        }
        alert("Nhập thành công " + importedCount + " dòng!");
        initData();
    };
    reader.readAsText(file);
    event.target.value = '';
}

// --- NOTIFICATIONS ---
function toggleNotifications() {
    const panel = document.getElementById('notification-panel');
    if (panel.style.display === 'none' || panel.style.display === '') {
        renderNotifications();
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

function renderNotifications() {
    const list = document.getElementById('notification-list');
    const badge = document.getElementById('notification-badge');
    
    let notifs = [];
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    products.forEach(p => {
        if (!p.is_deleted && p.stock < p.safe_stock_level) {
            notifs.push({ date: today, text: `<span style="color:red; font-weight:bold;">Tồn kho thấp:</span> Sản phẩm ${p.id} (${p.stock} ${p.unit})` });
        }
    });
    
    inventory_tickets.forEach(ticket => {
        const d = new Date(ticket.date);
        if (d >= sevenDaysAgo) {
            let typeStr = ticket.type === 'import' ? '<span style="color:var(--status-daban-text);">Nhập kho</span>' : '<span style="color:var(--status-chogiao-text);">Xuất kho</span>';
            let partnerName = '';
            if(ticket.type === 'import') {
                const sup = suppliers.find(s => s.id === ticket.partner_id);
                partnerName = sup ? sup.name : ticket.partner_id;
            } else {
                const cus = customers.find(c => c.id === ticket.partner_id);
                partnerName = cus ? cus.name : (ticket.partner_id === 'RETAIL' ? 'Khách lẻ' : ticket.partner_id);
            }
            let itemNames = ticket.items.map(it => {
                const p = products.find(prod => prod.id === it.product_id);
                return `${it.qty} x ${p ? p.name : it.product_id}`;
            }).join(', ');
            notifs.push({ date: d, text: `<b>${typeStr}</b>: ${partnerName} (${itemNames}) <i>(${ticket.date})</i>` });
        }
    });
    
    notifs.sort((a,b) => b.date - a.date);
    if(badge) badge.innerText = notifs.length;
    
    if(list) {
        if(notifs.length === 0) {
            list.innerHTML = "<p>Không có thông báo nào trong 7 ngày qua.</p>";
        } else {
            list.innerHTML = notifs.map(n => `<div style="padding: 10px 0; border-bottom: 1px dashed var(--border-color);">${n.text}</div>`).join('');
        }
    }
}

// --- MODALS & HISTORIES ---
function openBatchHistory(productId) {
    const p = products.find(x => x.id === productId);
    if (!p || !p.batches) return;
    
    const tbody = document.getElementById('batch-history-body');
    tbody.innerHTML = p.batches.map(b => `
        <tr>
            <td>${b.ref_no || b.import_date}</td>
            <td>${b.import_date}</td>
            <td>${b.qty}</td>
            <td><button class="btn-primary" style="padding:2px 8px; font-size:11px; width:auto;" onclick="editBatch('${p.id}', '${b.ref_no || b.import_date}')">Sửa</button></td>
        </tr>
    `).join('');
    
    document.getElementById('modal-batch-history').style.display = 'flex';
}

function editBatch(productId, refOrDate) {
    const p = products.find(x => x.id === productId);
    const b = p.batches.find(x => (x.ref_no || x.import_date) === refOrDate);
    if (!b) return;
    
    document.getElementById('edit-batch-product-id').value = productId;
    document.getElementById('edit-batch-original-ref').value = refOrDate;
    document.getElementById('edit-batch-ref').value = b.ref_no || '';
    document.getElementById('edit-batch-date').value = b.import_date;
    document.getElementById('edit-batch-qty').value = b.qty;
    
    document.getElementById('modal-edit-batch').style.display = 'flex';
}

function saveEditedBatch() {
    const pId = document.getElementById('edit-batch-product-id').value;
    const origRef = document.getElementById('edit-batch-original-ref').value;
    const ref = document.getElementById('edit-batch-ref').value;
    const date = document.getElementById('edit-batch-date').value;
    const qty = parseInt(document.getElementById('edit-batch-qty').value);
    
    const p = products.find(x => x.id === pId);
    if(p) {
        const b = p.batches.find(x => (x.ref_no || x.import_date) === origRef);
        if(b) {
            b.ref_no = ref;
            b.import_date = date;
            b.qty = qty;
        }
    }
    closeModal('modal-edit-batch');
    openBatchHistory(pId);
    initData();
}

function openProductNote(productId) {
    const p = products.find(x => x.id === productId);
    if(!p) return;
    
    const html = `
        <textarea id="temp-product-note" class="input-control" rows="4" style="width:100%; margin-bottom:10px;">${p.note || ''}</textarea>
        <button class="btn-primary" onclick="saveProductNote('${p.id}')">Lưu Ghi Chú</button>
    `;
    
    document.getElementById('note-modal').querySelector('.modal-header h3').innerText = `Ghi chú: ${p.name}`;
    document.getElementById('note-content').innerHTML = html;
    document.getElementById('note-modal').style.display = 'flex';
}

function saveProductNote(productId) {
    const p = products.find(x => x.id === productId);
    if(p) {
        p.note = document.getElementById('temp-product-note').value;
        initData();
        closeModal('note-modal');
    }
}

function openPriceHistory(productId) {
    const p = products.find(x => x.id === productId);
    if (!p) return;
    
    const tbody = document.getElementById('price-history-body');
    const hist = p.price_history || [];
    
    if(hist.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Chưa có lịch sử thay đổi giá</td></tr>';
    } else {
        tbody.innerHTML = hist.map(h => `
            <tr>
                <td>${h.date}</td>
                <td>${h.old_in.toLocaleString()} ➔ <b>${h.new_in.toLocaleString()}</b></td>
                <td>${h.old_out.toLocaleString()} ➔ <b style="color:var(--status-daban-text)">${h.new_out.toLocaleString()}</b></td>
            </tr>
        `).reverse().join('');
    }
    document.getElementById('price-history-title').innerText = `Lịch sử giá: ${p.name}`;
    document.getElementById('modal-price-history').style.display = 'flex';
}

// --- PDF GENERATION ---
function exportQuotePDF(qId) {
    const q = quotes.find(x => x.id === qId);
    if (!q) return;
    const cus = customers.find(c => c.id === q.customer_id) || {};
    
    document.getElementById('export-quote-id').value = qId;
    document.getElementById('pdf-input-quote-id').value = qId;
    document.getElementById('pdf-input-customer').value = cus.name || q.customer_id;
    document.getElementById('pdf-input-contact').value = (cus.contacts && cus.contacts.length > 0) ? cus.contacts[0].name : '';
    document.getElementById('pdf-input-phone').value = cus.phone || '';
    
    const d = new Date();
    document.getElementById('pdf-input-date').value = "TP. Hồ Chí Minh ngày " + d.getDate().toString().padStart(2, '0') + " tháng " + (d.getMonth() + 1).toString().padStart(2, '0') + " năm " + d.getFullYear();
    
    document.getElementById('modal-export-quote-pdf').style.display = 'flex';
}

function confirmExportQuotePDF() {
    const qId = document.getElementById('export-quote-id').value;
    const q = quotes.find(x => x.id === qId);
    if (!q) return;
    
    const companyName = document.getElementById('pdf-input-company').value;
    const companyAddress = document.getElementById('pdf-input-address').value;
    const companyEmail = document.getElementById('pdf-input-email').value;
    const dateFull = document.getElementById('pdf-input-date').value;
    const customQuoteId = document.getElementById('pdf-input-quote-id').value;
    
    const customerName = document.getElementById('pdf-input-customer').value;
    const contactName = document.getElementById('pdf-input-contact').value;
    const phone = document.getElementById('pdf-input-phone').value;
    
    const seller = document.getElementById('pdf-input-seller').value;
    const sellerPhone = document.getElementById('pdf-input-seller-phone').value;
    const content = document.getElementById('pdf-input-content').value;
    const version = document.getElementById('pdf-input-version').value;
    const notes = document.getElementById('pdf-input-notes').value;
    const payment = document.getElementById('pdf-input-payment').value;
    const delivery = document.getElementById('pdf-input-delivery').value;
    const validity = document.getElementById('pdf-input-validity').value;
    const vatPercent = parseFloat(document.getElementById('pdf-input-vat').value) || 0;
    const signerName = document.getElementById('pdf-input-signer').value;
    
    closeModal('modal-export-quote-pdf');
    
    // Set company details
    document.querySelectorAll('#pdf-quote-template .pdf-company-name').forEach(el => el.innerText = companyName);
    const shortName = document.querySelector('#pdf-quote-template .pdf-company-name-short');
    if (shortName) shortName.innerText = companyName; // Default short name to full name if modified
    document.querySelector('#pdf-quote-template .pdf-company-address').innerText = companyAddress;
    document.querySelector('#pdf-quote-template .pdf-company-email').innerText = companyEmail;
    document.querySelector('#pdf-quote-template .pdf-company-date-full').innerText = dateFull;
    
    // Set customer and quote details
    document.querySelector('#pdf-quote-template .pdf-customer-name').innerText = customerName;
    document.querySelector('#pdf-quote-template .pdf-quote-id').innerText = customQuoteId;
    document.querySelector('#pdf-quote-template .pdf-customer-contact').innerText = contactName;
    document.querySelector('#pdf-quote-template .pdf-customer-phone').innerText = phone;
    document.querySelector('#pdf-quote-template .pdf-seller').innerText = seller;
    document.querySelector('#pdf-quote-template .pdf-seller-phone').innerText = sellerPhone;
    document.querySelector('#pdf-quote-template .pdf-content').innerText = content;
    document.querySelector('#pdf-quote-template .pdf-version').innerText = version;
    document.querySelector('#pdf-quote-template .pdf-notes-content').innerText = notes;
    document.querySelector('#pdf-quote-template .pdf-payment').innerText = payment;
    document.querySelector('#pdf-quote-template .pdf-delivery').innerText = delivery;
    document.querySelector('#pdf-quote-template .pdf-validity').innerText = validity;
    document.querySelectorAll('#pdf-quote-template .pdf-vat-percent').forEach(el => el.innerText = vatPercent);
    document.querySelector('#pdf-quote-template .pdf-signer-name').innerText = signerName;
    
    let subtotal = 0;
    const tbody = document.querySelector('#pdf-quote-template .pdf-quote-items');
    tbody.innerHTML = q.items.map((item, idx) => {
        const lineTotal = item.qty * item.price;
        subtotal += lineTotal;
        return `
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">${idx + 1}</td>
                <td style="border: 1px solid #000; padding: 5px; text-align: left;">${item.name}</td>
                <td style="border: 1px solid #000; padding: 5px;">Cái</td>
                <td style="border: 1px solid #000; padding: 5px;">${item.qty.toLocaleString()}</td>
                <td style="border: 1px solid #000; padding: 5px; text-align: right;">${item.price.toLocaleString()}</td>
                <td style="border: 1px solid #000; padding: 5px; text-align: right;">${lineTotal.toLocaleString()}</td>
                <td style="border: 1px solid #000; padding: 5px;"></td>
            </tr>
        `;
    }).join('');
    
    const tax = subtotal * (vatPercent / 100);
    const total = subtotal + tax;
    
    document.querySelector('#pdf-quote-template .pdf-quote-subtotal').innerText = subtotal.toLocaleString();
    document.querySelector('#pdf-quote-template .pdf-quote-tax').innerText = tax.toLocaleString();
    document.querySelector('#pdf-quote-template .pdf-quote-total').innerText = total.toLocaleString();

    const element = document.getElementById('pdf-quote-template');
    element.style.display = 'block';
    
    const opt = {
        margin: 0,
        filename: `BaoGia_${q.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none';
    });
}

function exportDeliveryPDF(ticketId) {
    const t = inventory_tickets.find(x => x.id === ticketId);
    if (!t) return;
    
    document.getElementById('export-delivery-index').value = ticketId;
    
    // Attempt to find customer details
    let customerName = "Khách hàng B2B / Bán lẻ";
    let address = "";
    let contact = "";
    let phone = "";
    
    const cus = customers.find(c => c.id === t.partner_id);
    if(cus) {
        customerName = cus.name;
        address = cus.address || '';
        contact = (cus.contacts && cus.contacts.length > 0) ? cus.contacts[0].name : '';
        phone = cus.phone || '';
    } else {
        if(t.note && t.note.includes("HĐ")) {
            const ctId = t.note.split("HĐ ")[1];
            const ct = contracts.find(x => x.id === ctId);
            if(ct) {
                const autoCus = customers.find(c => c.id === ct.customer_id);
                if(autoCus) {
                    customerName = autoCus.name;
                    address = autoCus.address || '';
                    contact = (autoCus.contacts && autoCus.contacts.length > 0) ? autoCus.contacts[0].name : '';
                    phone = autoCus.phone || '';
                }
            }
        }
    }
    
    document.getElementById('pdf-del-input-customer').value = customerName;
    document.getElementById('pdf-del-input-address').value = address;
    document.getElementById('pdf-del-input-contact').value = contact;
    document.getElementById('pdf-del-input-phone').value = phone;
    document.getElementById('modal-export-delivery-pdf').style.display = 'flex';
}

function confirmExportDeliveryPDF() {
    const ticketId = document.getElementById('export-delivery-index').value;
    const t = inventory_tickets.find(x => x.id === ticketId);
    if (!t) return;
    
    const customerName = document.getElementById('pdf-del-input-customer').value;
    const address = document.getElementById('pdf-del-input-address').value;
    const contactName = document.getElementById('pdf-del-input-contact').value;
    const phone = document.getElementById('pdf-del-input-phone').value;
    const payment = document.getElementById('pdf-del-input-payment').value;
    
    closeModal('modal-export-delivery-pdf');
    
    document.querySelector('#pdf-delivery-template .pdf-del-date').innerText = new Date(t.date).toLocaleDateString('vi-VN');
    document.querySelector('#pdf-delivery-template .pdf-del-id').innerText = t.id;
    document.querySelector('#pdf-delivery-template .pdf-del-customer').innerText = customerName;
    document.querySelector('#pdf-delivery-template .pdf-del-address').innerText = address;
    document.querySelector('#pdf-delivery-template .pdf-del-contact').innerText = contactName;
    document.querySelector('#pdf-delivery-template .pdf-del-phone').innerText = phone;
    
    const tbody = document.querySelector('#pdf-delivery-template .pdf-del-items');
    tbody.innerHTML = t.items.map((item, idx) => {
        const p = products.find(x => x.id === item.product_id);
        return `
            <tr>
                <td style="border: 1px solid #000; padding: 5px;">${idx + 1}</td>
                <td style="border: 1px solid #000; padding: 5px; text-align: left;">${p ? p.name : item.product_id}</td>
                <td style="border: 1px solid #000; padding: 5px;">${p ? p.unit : 'Cái'}</td>
                <td style="border: 1px solid #000; padding: 5px;">${item.qty.toLocaleString()}</td>
                <td style="border: 1px solid #000; padding: 5px;">Lô: ${item.ref_no || ''}</td>
            </tr>
        `;
    }).join('');
    
    const element = document.getElementById('pdf-delivery-template');
    element.style.display = 'block';
    
    const opt = {
        margin: 0,
        filename: `PhieuXuat_${t.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none';
    });
}
