export const REVENUE_CONFIG = {
  commissionRate: 0.1,
  cashbackRate: 0.02,
  warrantyDays: 7,
};

export function calculateRevenue(totalAmount: number) {
  const cleanAmount = Number(totalAmount || 0);
  const platformFee = Math.round(cleanAmount * REVENUE_CONFIG.commissionRate);
  const cashbackAmount = Math.round(cleanAmount * REVENUE_CONFIG.cashbackRate);
  const providerEarning = cleanAmount - platformFee;

  return {
    totalAmount: cleanAmount,
    commissionRate: REVENUE_CONFIG.commissionRate,
    platformFee,
    cashbackAmount,
    providerEarning,
  };
}

export function generateServiceCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getWarrantyDate() {
  const date = new Date();
  date.setDate(date.getDate() + REVENUE_CONFIG.warrantyDays);
  return date.toISOString();
}

export function formatMoney(amount: number | string | null | undefined) {
  const number = Number(amount || 0);
  return `Rs ${number.toLocaleString("en-IN")}`;
}