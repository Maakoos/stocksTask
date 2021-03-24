import { useState, useEffect, useCallback } from "react";

import SearchBar from "components/SearchBar";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState();
  const [hints, setHints] = useState([]);

  const handleOnChange = (e) => setInputValue(e.target.value);

  const clearInputValue = () => setInputValue("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo`
      );
      console.log(response);
      const json = await response.json();
      console.log(json);
      setData(json["Time Series (5min)"]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHintsCallback = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=tesco&apikey=demo`
      );
      const json = await response.json();
      setHints(json.bestMatches);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (inputValue.length > 2) {
      fetchHintsCallback();
    }
  }, [inputValue, fetchHintsCallback]);

  return (
    <div className="App">
      <h1>Hello world!</h1>
      <SearchBar
        inputValue={inputValue}
        changeInputValue={handleOnChange}
        clearInputValue={clearInputValue}
        hints={hints}
        setHints={setHints}
        fetchData={fetchData}
      />
    </div>
  );
}

export default App;
