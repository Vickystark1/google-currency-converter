import { useEffect, useState } from "react";
import "./App.css";
import Currencyrates from "./Currencyrates";
import CurrencyratesTwo from "./CurrencyratesTwo";
import { format } from "date-fns";
import { Col, Container, Stack } from "react-bootstrap";

function App() {
  const API_KEY = "c07af4ad938ca9d0304682cc";

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
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/AED`
        );
        const data = await res.json();
        console.log("ress",res);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        };
        
        console.log("res",res);
        console.log("data",data);
        setCurrencyRates(data.conversion_rates);
      } catch (err) {
        console.log("error fetching data", err);
        setCurrencyRates(null);
      }
    }

    fetchData();


  //   async function fetchData1(){

  //     const url = 'https://api.apilayer.com/currency_data/convert?base=USD&symbols=EUR,GBP';
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'X-RapidAPI-Key': '0fd734de30msh442b171a52a709fp1924ebjsnb74917afe620',
  //     'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
  //   }
  // };
  
  // try {
  //   const response = await fetch(url, options);
  //   console.log("res11",response);
  //   const result = await response.text();
  //   console.log(result);
  // } catch (error) {
  //   console.error("error",error);
  // }
  //   }

  //   fetchData1();

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
      <div className="container" style={{width:"maxContent"}}>
        <span
          id="larkMode"
          style={{ cursor: "pointer" }}
          className="toggle-mode"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? "🌞" : "🌜"}
        </span>
       <div className="container">
        
        <h1 className="title" style={{fontSize:"30px"}} >
          <span style={{ color: "#0000FF" }}>G</span>
          <span style={{ color: "#FF0000" }}>o</span>
          <span style={{ color: "#FFFF00" }}>o</span>
          <span style={{ color: "#0000FF" }}>g</span>
          <span style={{ color: "#008000" }}>l</span>
          <span style={{ color: "#FF0000", marginRight: "8px" }}>e </span>{" "}
          <span className="curr">Currency Converter</span>
        </h1>
       </div>
          
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
