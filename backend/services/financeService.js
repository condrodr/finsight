export const calculateSummary = (transactions) => {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  });

  return {
    income,
    expense,
    balance: income - expense
  };
};