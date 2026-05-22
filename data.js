let products = [
    { 
        id: "SKU001", name: "Bơm ly tâm trục ngang Ebara", price_in: 25000000, price_out: 30000000, unit: "Cái", 
        safe_stock_level: 5, stock: 15, note: "Bơm nhập khẩu Ý, CO/CQ đầy đủ.", price_history: [],
        specs: { power: "15kW", pipe_rows: "N/A", component_type: "Bơm" },
        batches: [ { import_date: "2026-04-15", qty: 10 }, { import_date: "2026-05-01", qty: 5 } ]
    },
    { 
        id: "SKU002", name: "Công tắc phao báo mức Mac3", price_in: 1800000, price_out: 2200000, unit: "Cái", 
        safe_stock_level: 20, stock: 50, note: "", price_history: [],
        specs: { power: "N/A", pipe_rows: "N/A", component_type: "Công tắc phao" },
        batches: [ { import_date: "2026-04-10", qty: 50 } ]
    },
    { 
        id: "SKU003", name: "Dàn trao đổi nhiệt dạng tấm Alfa Laval", price_in: 32000000, price_out: 40000000, unit: "Bộ", 
        safe_stock_level: 2, stock: 4, note: "Bảo hành 24 tháng.", price_history: [],
        specs: { power: "500kW", pipe_rows: "40 Tấm", component_type: "Dàn trao đổi nhiệt" },
        batches: [ { import_date: "2026-03-20", qty: 4 } ]
    },
    { 
        id: "SKU004", name: "Ống đồng cuộn Hailiang", price_in: 6000000, price_out: 7500000, unit: "Cuộn", 
        safe_stock_level: 15, stock: 10, note: "", price_history: [],
        specs: { power: "N/A", pipe_rows: "N/A", component_type: "Vật tư phụ" },
        batches: [ { import_date: "2026-04-05", qty: 10 } ]
    },
    { 
        id: "SKU005", name: "Van bướm điều khiển điện Belimo", price_in: 6500000, price_out: 7990000, unit: "Cái", 
        safe_stock_level: 10, stock: 30, note: "", price_history: [],
        specs: { power: "24V", pipe_rows: "N/A", component_type: "Van" },
        batches: [ { import_date: "2026-05-02", qty: 30 } ]
    }
];

let customers = [
    { 
        id: "CUS001", name: "Công ty Cổ phần Xây dựng ABC", industry: "Xây dựng", phone: "0901234567", address: "123 Lê Lợi, Q1, TP.HCM", type: "VIP",
        debt_limit: 500000000,
        contacts: [
            { name: "Nguyễn Văn A", role: "Giám đốc Dự án", phone: "0911111111" },
            { name: "Trần Thị B", role: "Kế toán trưởng", phone: "0922222222" }
        ],
        interaction_logs: [
            { date: "2026-05-01", user: "Nguyễn Kinh Doanh", note: "Gặp trực tiếp báo giá lô bơm Ebara." }
        ]
    },
    { 
        id: "CUS002", name: "Công ty TNHH Cơ điện XYZ", industry: "M&E", phone: "0912345678", address: "456 Nguyễn Huệ, Q1, TP.HCM", type: "Thường",
        debt_limit: 100000000,
        contacts: [
            { name: "Lê Văn C", role: "Trưởng phòng Kỹ thuật", phone: "0933333333" }
        ],
        interaction_logs: []
    }
];

let suppliers = [
    { 
        id: "SUP001", name: "Nhà phân phối Ebara Việt Nam", industry: "Nhà sản xuất", phone: "0988888888", address: "Hà Nội", 
        contacts: [ { name: "Hoàng D", role: "Sales Manager", phone: "0944444444" } ]
    },
    { 
        id: "SUP002", name: "Tổng kho Vật tư Lạnh", industry: "Thương mại", phone: "0977777777", address: "Bình Dương", 
        contacts: [ { name: "Phạm E", role: "Trưởng kho", phone: "0955555555" } ]
    }
];

let quotes = [
    {
        id: "QT-2026-001", date: "2026-05-01", customer_id: "CUS001", status: "Chờ duyệt", total_amount: 110000000,
        items: [
            { product_id: "SKU001", qty: 2, price: 30000000 },
            { product_id: "SKU003", qty: 1, price: 40000000 },
            { product_id: "SKU004", qty: 1, price: 10000000 } // Custom price
        ]
    }
];

let contracts = [
    {
        id: "HD-2026-001", quote_id: "QT-2026-000", date: "2026-04-10", customer_id: "CUS002", total_amount: 150000000, status: "Đang thực hiện",
        milestones: [
            { name: "Tạm ứng 30%", amount: 45000000, paid: true },
            { name: "Giao hàng 50%", amount: 75000000, paid: false },
            { name: "Nghiệm thu 20%", amount: 30000000, paid: false }
        ]
    }
];

let cashflow = [
    { id: "CF-001", date: "2026-04-12", type: "in", amount: 45000000, reference_id: "HD-2026-001", note: "Khách tạm ứng HĐ HD-2026-001" },
    { id: "CF-002", date: "2026-04-15", type: "out", amount: 250000000, reference_id: "SUP001", note: "Thanh toán công nợ Ebara" }
];

let employees = [
    { id: "EMP001", name: "Nguyễn Kinh Doanh", role: "Sales", kpi_target: 1000000000, kpi_achieved: 150000000, projects: ["HD-2026-001"] },
    { id: "EMP002", name: "Trần Kỹ Thuật", role: "Engineer", kpi_target: 0, kpi_achieved: 0, projects: ["HD-2026-001"] }
];

let inventory_tickets = [
    { 
        id: "IMP-1715000000000",
        date: "2026-04-15 08:00:00",
        type: "import", 
        partner_id: "SUP001",
        note: "Nhập hàng đợt 1",
        items: [
            { product_id: "SKU001", ref_no: "2026-04-15", qty: 10 }
        ]
    }
];

let users = [
    { username: "admin", password: "123", role: "admin", name: "Quản trị viên" },
    { username: "nhanvien", password: "123", role: "view_only", name: "Nhân viên xem" }
];
