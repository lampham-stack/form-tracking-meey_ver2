// ===== GOOGLE APPS SCRIPT - PASTE VÀO APPS SCRIPT EDITOR =====
// File này chạy trên Google Server, KHÔNG phải trên browser

// Handle GET requests (for testing in browser)
function doGet(e) {
  return ContentService.createTextOutput(
    "Survey API is running. Use POST to submit data.",
  ).setMimeType(ContentService.MimeType.TEXT);
}

// Handle POST requests (from the form)
function doPost(e) {
  try {
    // Debug logging
    Logger.log("=== NEW SUBMISSION ===");
    Logger.log("Request received at: " + new Date().toISOString());

    // Check if postData exists
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log("ERROR: No postData found");
      Logger.log("Event object: " + JSON.stringify(e));
      throw new Error("No data received");
    }

    // Parse dữ liệu từ frontend
    const data = JSON.parse(e.postData.contents);
    Logger.log("Parsed data: " + JSON.stringify(data));

    // Validate required fields
    if (!data.name || !data.phone) {
      throw new Error("Missing required fields: name or phone");
    }

    // Mở Google Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Chuẩn bị dữ liệu để ghi vào sheet
    // QUAN TRỌNG: Thứ tự phải khớp với header trong Sheet
    // Header: Timestamp | Tên | Số điện thoại | Sản phẩm quan tâm | Nguồn
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.name || "",
      data.phone || "",
      data.products || "",
      data.source || "direct",
    ];

    Logger.log("Writing row: " + JSON.stringify(rowData));

    // Ghi vào sheet
    sheet.appendRow(rowData);

    Logger.log("✅ Success! Row written to sheet");

    // Trả về success
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "success",
        message: "Đã lưu thành công",
        data: {
          name: data.name,
          source: data.source,
        },
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Log lỗi chi tiết để debug
    Logger.log("❌ ERROR: " + error.toString());
    Logger.log("Error stack: " + error.stack);

    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        message: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== HƯỚNG DẪN SỬ DỤNG =====
// 1. Copy toàn bộ code này
// 2. Paste vào Apps Script Editor (thay thế code cũ hoàn toàn)
// 3. Click "Deploy" > "Manage deployments"
// 4. Click icon "Edit" (bút chì) ở deployment hiện tại
// 5. Click "New version" để tạo version mới
// 6. Click "Deploy"
// 7. URL sẽ giữ nguyên, không cần update lại trong script.js

// ===== CÁCH TEST =====
// 1. Sau khi deploy, click vào URL của web app
// 2. Bạn sẽ thấy message: "Survey API is running. Use POST to submit data."
// 3. Điều này chứng tỏ Apps Script đang chạy đúng
// 4. Giờ test bằng cách submit form thật từ website

// ===== CÁCH XEM LOG =====
// 1. Trong Apps Script Editor, click "Executions" ở sidebar trái
// 2. Click vào execution gần nhất để xem log chi tiết
// 3. Bạn sẽ thấy tất cả dữ liệu được gửi lên, bao gồm source
