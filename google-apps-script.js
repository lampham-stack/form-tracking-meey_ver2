/**
 * Google Apps Script để nhận dữ liệu từ form khảo sát
 * và ghi vào Google Sheets
 * 
 * HƯỚNG DẪN SETUP:
 * 1. Mở Google Sheets: https://docs.google.com/spreadsheets/d/1G5ZdNZ4KbHBPGMxQHx37GR3j0UfrhbjBjIaeRGP_x-k/edit
 * 2. Vào Extensions → Apps Script
 * 3. Copy toàn bộ code này vào
 * 4. Click "Deploy" → "New deployment"
 * 5. Chọn type: "Web app"
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. Click "Deploy" và copy URL
 * 9. Paste URL vào file script.js (biến GOOGLE_SCRIPT_URL)
 */

// ID của Google Sheets (đã có sẵn trong URL)
const SPREADSHEET_ID = '1G5ZdNZ4KbHBPGMxQHx37GR3j0UfrhbjBjIaeRGP_x-k';

// Tên sheet để ghi dữ liệu (có thể đổi nếu cần)
const SHEET_NAME = 'Responses';

/**
 * Hàm xử lý POST request từ form
 */
function doPost(e) {
  try {
    // Kiểm tra xem có postData không (khi test trực tiếp sẽ không có)
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService
        .createTextOutput(JSON.stringify({
          result: 'error',
          message: 'No data received. Please use testDoPost() function to test, or send POST request from form.'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse dữ liệu JSON từ request
    const data = JSON.parse(e.postData.contents);
    
    // Mở spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Lấy hoặc tạo sheet "Responses"
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      
      // Tạo header row nếu sheet mới
      const headers = ['Timestamp', 'Tên', 'Số điện thoại', 'Sản phẩm quan tâm', 'Nguồn'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format header
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#001BB0')
        .setFontColor('#FFFFFF');
      
      // Freeze header row
      sheet.setFrozenRows(1);
      
      // Auto-resize columns
      sheet.autoResizeColumns(1, headers.length);
    }
    
    // Chuẩn bị dữ liệu để ghi
    const timestamp = new Date(data.timestamp);
    const name = data.name || '';
    const phone = data.phone || '';
    const products = data.products || '';
    const source = data.group || 'direct';
    
    // Thêm row mới
    const newRow = [timestamp, name, phone, products, source];
    sheet.appendRow(newRow);
    
    // Format timestamp column
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
    
    // Log thành công
    Logger.log('Successfully added response from: ' + name);
    
    // Trả về response thành công
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        message: 'Data saved successfully',
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log lỗi
    Logger.log('Error: ' + error.toString());
    
    // Trả về response lỗi
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Hàm test để kiểm tra script
 */
function testDoPost() {
  const testData = {
    timestamp: new Date().toISOString(),
    name: 'Nguyễn Văn A',
    phone: '+84912345678',
    email: 'test@example.com',
    products: 'MeeyMap, MeeyAI',
    group: 'facebook'
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(e);
  Logger.log(result.getContent());
}

/**
 * Hàm GET để test xem script có hoạt động không
 */
function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script is running! Use POST method to submit data.')
    .setMimeType(ContentService.MimeType.TEXT);
}
