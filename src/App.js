import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";

import SearchBar from "components/SearchBar";
import InfoGraph from "components/InfoGraph";

const AppWrapper = styled.div`
  max-width: 1650px;
  margin: 0 auto;
`;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [hints, setHints] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [globalInfo, setGlobalInfo] = useState(null);

  const handleOnChange = (e) => setInputValue(e.target.value);

  const clearInputValue = () => setInputValue("");

  const fetchData = async () => {
    try {
      let [graph, globalInfo] = await Promise.all([
        fetch(
          "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo"
        ),
        fetch(
          "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=demo"
        ),
      ]);
      const json = await graph.json();
      setGraphData(json["Time Series (5min)"]);

      const globalInfoJson = await globalInfo.json();
      setGlobalInfo(globalInfoJson["Global Quote"]);
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
    <AppWrapper>
      <h1>Hello world!</h1>
      <SearchBar
        inputValue={inputValue}
        changeInputValue={handleOnChange}
        clearInputValue={clearInputValue}
        hints={hints}
        setHints={setHints}
        fetchData={fetchData}
      />
      {globalInfo && (
        <InfoGraph graphData={graphData} globalInfo={globalInfo} />
      )}
    </AppWrapper>
  );
}

export default App;
