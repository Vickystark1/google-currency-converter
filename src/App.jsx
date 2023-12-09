import { useEffect, useState } from "react";
import "./App.css";
import Currencyrates from "./Currencyrates";
import CurrencyratesTwo from "./CurrencyratesTwo";
import { format } from "date-fns";

function App() {
  const API_KEY = "64ebb02157d6a52bec77578030032739";

  //https://api.exchangeratesapi.io/v1/latest?access_key =ab6cb52bad19f2430774aa072744a9bc

  const [currencyRates, setCurrencyRates] = useState([]);
  const [amountOne, setAmountOne] = useState(1);
  const [amountTwo, setAmountTwo] = useState(1);
  const [currencyOne, setCurrencyOne] = useState("USD");
  const [currencyTwo, setCurrencyTwo] = useState("INR");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://data.fixer.io/api/latest?access_key=${API_KEY}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log(data.rates);
        setCurrencyRates(data.rates);
      } catch (err) {
        console.log("error fetching data", err);
        setCurrencyRates(null);
      }
    }

    fetchData();
  }, []);

  const fixedCurrency = (number) => {
    // Check if 'number' is a valid numeric value
    if (typeof number !== "number" || isNaN(number)) {
      console.error("Invalid numeric value:", number);
      return 0; // or any default value you prefer
    }

    // Call toFixed only if 'number' is a valid number
    return parseFloat(number.toFixed(2));
  };

  const handleAmountOneChange = (amountOne) => {
    setAmountTwo(
      fixedCurrency(
        (amountOne * currencyRates[currencyTwo]) / currencyRates[currencyOne]
      )
    );
    setAmountOne(amountOne);
  };

  const handleAmountTwoChange = (amountTwo) => {
    setAmountOne(
      fixedCurrency(
        (amountTwo * currencyRates[currencyOne]) / currencyRates[currencyTwo]
      )
    );
    setAmountTwo(amountTwo);
  };

  const handleCurrencyOneChange = (currencyOne) => {
    setAmountTwo(
      (amountOne * currencyRates[currencyTwo]) / currencyRates[currencyOne]
    );
    setCurrencyOne(currencyOne);
  };

  const handleCurrencyTwoChange = (currencyTwo) => {
    setAmountOne(
      (amountTwo * currencyRates[currencyOne]) / currencyRates[currencyTwo]
    );
    setCurrencyTwo(currencyTwo);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    if (currencyRates) {
      handleAmountOneChange(1);
    }
  }, [currencyRates]);

  useEffect(() => {
    // Apply the dark or light mode class to the body
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);

    // Persist the user's preference in local storage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  if (!currencyRates) return <p>Something went wrong.</p>;
  if (currencyRates.length === 0) return <p>Loading ...</p>;

  return (
    <>
      <div className="container">
        <span
          id="larkMode"
          style={{ cursor: "pointer" }}
          className="toggle-mode"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? "🌞" : "🌜"}
        </span>
        <h2>
          <span style={{ color: "#0000FF" }}>G</span>
          <span style={{ color: "#FF0000" }}>o</span>
          <span style={{ color: "#FFFF00" }}>o</span>
          <span style={{ color: "#0000FF" }}>g</span>
          <span style={{ color: "#008000" }}>l</span>
          <span style={{ color: "#FF0000", marginRight: "8px" }}>e </span>{" "}
          <div>Currency Converter</div>
        </h2>
        <p id="currencyOne" className="oneCurrencyText">
          {" "}
          {amountOne} {currencyOne} equals{" "}
        </p>
        <p className={`rateText ${isDarkMode ? "dark-text" : ""}`} id="ptag">
          {fixedCurrency(amountTwo)} {currencyTwo}
        </p>
        <p className="date">{format(new Date(), "dd/MM , h:mm")}</p>
        <Currencyrates
          amount={amountOne}
          currency={currencyOne}
          currencies={Object.keys(currencyRates)}
          onAmountChange={handleAmountOneChange}
          onCurrencyChange={handleCurrencyOneChange}
        />
        <br />
        <CurrencyratesTwo
          amount={amountTwo}
          currency={currencyTwo}
          currencies={Object.keys(currencyRates)}
          onAmountChange={handleAmountTwoChange}
          onCurrencyChange={handleCurrencyTwoChange}
        />
      </div>
    </>
  );
}

export default App;
