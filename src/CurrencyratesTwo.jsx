import "./Currencyrates.css";

const CurrencyratesTwo = ({
  amount,
  currencies,
  currency,
  onCurrencyChange,
}) => {
  return (
    <div className="wrapper">
      <input value={amount} readOnly />
      <select
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyratesTwo;
