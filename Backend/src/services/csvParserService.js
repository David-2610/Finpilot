const fs = require('fs');
const csv = require('csv-parser');
const stream = require('stream');

const parseSBICSV = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const headerString = 'Date,Details,Ref No/Cheque No,Debit,Credit,Balance';
      const headerIndex = fileContent.indexOf(headerString);
      
      if (headerIndex === -1) {
        return reject(new Error('Invalid CSV format. Header not found.'));
      }
      
      const csvData = fileContent.substring(headerIndex);
      const results = [];
      const readable = stream.Readable.from([csvData]);
      
      readable
        .pipe(csv())
        .on('data', (data) => {
          // Check if valid row
          if (data.Date && data.Date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const creditStr = data.Credit ? data.Credit.replace(/,/g, '').trim() : '';
            const debitStr = data.Debit ? data.Debit.replace(/,/g, '').trim() : '';
            const amount = debitStr ? parseFloat(debitStr) : (creditStr ? parseFloat(creditStr) : 0);
            
            if (isNaN(amount) || amount === 0) return;
            
            const type = debitStr ? 'debit' : 'credit';
            const balanceAfter = data.Balance ? parseFloat(data.Balance.replace(/,/g, '').trim()) : 0;
            
            const rawDescription = data.Details ? data.Details.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim() : '';
            
            let paymentMode = 'OTHER';
            if (rawDescription.includes('UPI/')) paymentMode = 'UPI';
            else if (rawDescription.includes('IMPS')) paymentMode = 'IMPS';
            else if (rawDescription.includes('NEFT')) paymentMode = 'NEFT';
            
            let merchant = '';
            let counterparty = '';
            
            if (paymentMode === 'UPI') {
              const parts = rawDescription.split('/');
              if (parts.length > 4) {
                 counterparty = parts[3].trim(); 
                 merchant = counterparty; 
              }
            }
            
            // Hardcode some extractors for now to avoid empty merchants
            if (!merchant) {
               if (rawDescription.toLowerCase().includes('zepto')) merchant = 'Zepto';
               else if (rawDescription.toLowerCase().includes('google')) merchant = 'Google';
               else if (rawDescription.toLowerCase().includes('interest')) merchant = 'Bank Interest';
               else merchant = 'Other';
            }
            
            const dateParts = data.Date.split('/');
            const formattedDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T00:00:00.000Z`);
            
            results.push({
               date: formattedDate,
               amount,
               type,
               balanceAfter,
               rawDescription,
               merchant,
               counterparty,
               paymentMode
            });
          }
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { parseSBICSV };
