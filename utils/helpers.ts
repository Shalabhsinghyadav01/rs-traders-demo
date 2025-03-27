let lastInvoiceNumber = 0;

export function generateInvoiceNumber(): string {
  const prefix = 'INV';
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  lastInvoiceNumber++;
  const sequence = lastInvoiceNumber.toString().padStart(4, '0');
  return `${prefix}/${year}${month}/${sequence}`;
}

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  
  if (num < 20) return ones[num];
  
  if (num < 100) {
    return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
  }
  
  return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + convertLessThanThousand(num % 100) : '');
}

export function numberToWords(amount: number): string {
  if (amount === 0) return 'Zero';

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  
  let result = '';
  let remaining = rupees;
  
  if (remaining > 999999999) {
    const billions = Math.floor(remaining / 1000000000);
    result += convertLessThanThousand(billions) + ' Billion ';
    remaining %= 1000000000;
  }
  
  if (remaining > 9999999) {
    const crores = Math.floor(remaining / 10000000);
    result += convertLessThanThousand(crores) + ' Crore ';
    remaining %= 10000000;
  }
  
  if (remaining > 99999) {
    const lakhs = Math.floor(remaining / 100000);
    result += convertLessThanThousand(lakhs) + ' Lakh ';
    remaining %= 100000;
  }
  
  if (remaining > 999) {
    const thousands = Math.floor(remaining / 1000);
    result += convertLessThanThousand(thousands) + ' Thousand ';
    remaining %= 1000;
  }
  
  result += convertLessThanThousand(remaining);
  
  if (paise > 0) {
    result += ' and ' + convertLessThanThousand(paise) + ' Paise';
  }
  
  return result.trim();
} 