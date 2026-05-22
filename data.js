let products = [];

let customers = [
    {
        "id": "CUS001",
        "name": "Công ty Cổ phần Xây dựng ABC",
        "industry": "Xây dựng",
        "phone": "0901234567",
        "address": "123 Lê Lợi, Q1, TP.HCM",
        "type": "VIP",
        "debt_limit": 500000000,
        "contacts": [
            {
                "name": "Nguyễn Văn A",
                "role": "Giám đốc Dự án",
                "phone": "0911111111"
            },
            {
                "name": "Trần Thị B",
                "role": "Kế toán trưởng",
                "phone": "0922222222"
            }
        ],
        "interaction_logs": [
            {
                "date": "2026-05-01",
                "user": "Nguyễn Kinh Doanh",
                "note": "Gặp trực tiếp báo giá lô bơm Ebara."
            }
        ]
    },
    {
        "id": "CUS002",
        "name": "Công ty TNHH Cơ điện XYZ",
        "industry": "M&E",
        "phone": "0912345678",
        "address": "456 Nguyễn Huệ, Q1, TP.HCM",
        "type": "Thường",
        "debt_limit": 100000000,
        "contacts": [
            {
                "name": "Lê Văn C",
                "role": "Trưởng phòng Kỹ thuật",
                "phone": "0933333333"
            }
        ],
        "interaction_logs": []
    }
];

let suppliers = [
    {
        "id": "NCC-001",
        "name": "Varin",
        "industry": "Cung cấp vật tư",
        "phone": "",
        "address": "",
        "contacts": [
            {
                "name": "Ms.Ngân",
                "role": "Nhân viên Sale",
                "phone": ""
            }
        ]
    }
];

let quotes = [
    {
        "id": "QT-2026-001",
        "date": "2026-05-01",
        "customer_id": "CUS001",
        "status": "Chờ duyệt",
        "total_amount": 110000000,
        "items": [
            {
                "product_id": "SKU001",
                "qty": 2,
                "price": 30000000
            },
            {
                "product_id": "SKU003",
                "qty": 1,
                "price": 40000000
            },
            {
                "product_id": "SKU004",
                "qty": 1,
                "price": 10000000
            }
        ]
    }
];

let contracts = [
    {
        "id": "HD-2026-001",
        "quote_id": "QT-2026-000",
        "date": "2026-04-10",
        "customer_id": "CUS002",
        "total_amount": 150000000,
        "status": "Đang thực hiện",
        "milestones": [
            {
                "name": "Tạm ứng 30%",
                "amount": 45000000,
                "paid": true
            },
            {
                "name": "Giao hàng 50%",
                "amount": 75000000,
                "paid": false
            },
            {
                "name": "Nghiệm thu 20%",
                "amount": 30000000,
                "paid": false
            }
        ]
    }
];

let cashflow = [
    {
        "id": "CF-001",
        "date": "2026-04-12",
        "type": "in",
        "amount": 45000000,
        "reference_id": "HD-2026-001",
        "note": "Khách tạm ứng HĐ HD-2026-001"
    },
    {
        "id": "CF-002",
        "date": "2026-04-15",
        "type": "out",
        "amount": 250000000,
        "reference_id": "SUP001",
        "note": "Thanh toán công nợ Ebara"
    }
];

let employees = [
    {
        "id": "EMP001",
        "name": "Nguyễn Kinh Doanh",
        "role": "Sales",
        "kpi_target": 1000000000,
        "kpi_achieved": 150000000,
        "projects": [
            "HD-2026-001"
        ]
    },
    {
        "id": "EMP002",
        "name": "Trần Kỹ Thuật",
        "role": "Engineer",
        "kpi_target": 0,
        "kpi_achieved": 0,
        "projects": [
            "HD-2026-001"
        ]
    }
];

let inventory_tickets = [
    {
        "id": "IMP-1715000000000",
        "date": "2026-04-15 08:00:00",
        "type": "import",
        "partner_id": "SUP001",
        "note": "Nhập hàng đợt 1",
        "items": [
            {
                "product_id": "SKU001",
                "ref_no": "2026-04-15",
                "qty": 10
            }
        ]
    }
];
