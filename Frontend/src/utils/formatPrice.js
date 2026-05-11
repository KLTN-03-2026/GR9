export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

export const formatCurrencyVND = (price) => {
  const amount = Number(price) || 0;
  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(amount)} đ`;
};
