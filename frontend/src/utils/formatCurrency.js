/**
 * Format a number as Indian currency (with lakhs and crores)
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount
 */
export const formatIndianCurrency = (amount) => {
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid input
  if (isNaN(numAmount)) return 'Invalid amount';
  
  // Format in crores if amount is >= 1 crore
  if (numAmount >= 10000000) {
    return `₹ ${(numAmount / 10000000).toFixed(2)} Cr`;
  }
  
  // Format in lakhs if amount is >= 1 lakh
  if (numAmount >= 100000) {
    return `₹ ${(numAmount / 100000).toFixed(2)} L`;
  }
  
  // Format in thousands if amount is >= 1000
  if (numAmount >= 1000) {
    return `₹ ${(numAmount / 1000).toFixed(2)} K`;
  }
  
  // Format regular amount
  return `₹ ${numAmount.toFixed(2)}`;
};

/**
 * Format a number as regular currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted amount
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatIndianCurrency;
