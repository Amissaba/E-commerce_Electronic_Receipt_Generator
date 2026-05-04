const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const formatMoney = (amount) => {
  return `NGN ${Number(amount || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const generateReceiptPDF = (order) => {
  return new Promise((resolve, reject) => {
    const fileName = `receipt-${order.order_id}.pdf`;
    const folderPath = path.join(__dirname, '../tmp');
    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const items = order.product_data || [];
    const totalAmount = order.totalamount || 0;

    // ===== HEADER =====
    doc
      .rect(0, 0, doc.page.width, 100)
      .fill('#111827');

    doc
      .fillColor('#ffffff')
      .fontSize(24)
      .text('ELECTRONIC RECEIPT', 50, 35, {
        align: 'center'
      });

    doc
      .fontSize(10)
      .text('Thank you for your order', {
        align: 'center'
      });

    doc.moveDown(3);

    // ===== ORDER INFO =====
    doc
      .fillColor('#111827')
      .fontSize(14)
      .text('Order Information', 50, 130);

    doc
      .moveTo(50, 150)
      .lineTo(545, 150)
      .strokeColor('#d1d5db')
      .stroke();

    doc
      .fontSize(10)
      .fillColor('#374151')
      .text(`Order ID: ${order.order_id}`, 50, 165)
      .text(`Customer ID: ${order.customer_id}`, 50, 182)
      .text(`Status: ${order.order_status || 'PENDING'}`, 50, 199)
      .text(`Date: ${new Date().toLocaleString()}`, 50, 216);

    // ===== TABLE HEADER =====
    let tableTop = 260;

    doc
      .rect(50, tableTop, 495, 30)
      .fill('#f3f4f6');

    doc
      .fillColor('#111827')
      .fontSize(10)
      .text('Product', 60, tableTop + 10)
      .text('Qty', 310, tableTop + 10)
      .text('Unit Price', 360, tableTop + 10)
      .text('Subtotal', 465, tableTop + 10);

    let y = tableTop + 40;

    // ===== TABLE ROWS =====
    items.forEach((item, index) => {
      if (y > 720) {
        doc.addPage();
        y = 60;
      }

      if (index % 2 === 0) {
        doc
          .rect(50, y - 8, 495, 35)
          .fill('#fafafa');
      }

      doc
        .fillColor('#374151')
        .fontSize(9)
        .text(item.product_name, 60, y, {
          width: 230
        });

      doc
        .text(item.quantity, 315, y)
        .text(formatMoney(item.unit_price), 360, y, {
          width: 90,
          align: 'right'
        })
        .text(formatMoney(item.subtotal), 455, y, {
          width: 90,
          align: 'right'
        });

      y += 40;
    });

    // ===== TOTAL SECTION =====
    y += 20;

    doc
      .moveTo(350, y)
      .lineTo(545, y)
      .strokeColor('#d1d5db')
      .stroke();

    doc
      .fontSize(14)
      .fillColor('#111827')
      .text('Total:', 350, y + 15)
      .text(formatMoney(totalAmount), 430, y + 15, {
        width: 115,
        align: 'right'
      });

    // ===== FOOTER =====
    doc
      .fontSize(9)
      .fillColor('#6b7280')
      .text(
        'This receipt was generated electronically. Please keep it for your records.',
        50,
        760,
        { align: 'center' }
      );

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = {
  generateReceiptPDF
};