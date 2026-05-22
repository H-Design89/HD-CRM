Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Lấy đường dẫn tuyệt đối của file index.html nằm cùng thư mục với script
strPath = objFSO.GetAbsolutePathName("index.html")

' Lệnh khởi chạy Google Chrome dưới dạng Desktop App (cửa sổ độc lập, không tab, không thanh địa chỉ)
strCommand = "chrome.exe --app=""" & strPath & """"

' Thực thi lệnh (0: ẩn cửa sổ cmd nếu có, false: không chờ lệnh chạy xong)
objShell.Run strCommand, 1, False
