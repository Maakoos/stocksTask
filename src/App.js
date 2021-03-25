import { useState, useCallback } from "react";
import styled from "styled-components";

import SearchBar from "components/SearchBar";
import InfoGraph from "components/InfoGraph";
import CompanyOverview from "components/CompanyOverview";

const API_KEY = process.env.REACT_APP_API_KEY;

const AppWrapper = styled.div`
  max-width: 1650px;
  margin: 0 auto;
`;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [hints, setHints] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [globalInfo, setGlobalInfo] = useState(null);
  const [overviewInfo, setOverviewInfo] = useState();

  const handleOnChange = (e) => setInputValue(e.target.value);

  const clearInputValue = () => setInputValue("");

  const fetchData = async (symbol) => {
    try {
      let [graph, globalInfo, overview] = await Promise.all([
        fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        ),
        fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        ),
        fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
        ),
      ]);
      const json = await graph.json();
      console.log(json);
      setGraphData(json["Time Series (Daily)"]);

      const globalInfoJson = await globalInfo.json();
      console.log(globalInfoJson);
      setGlobalInfo(globalInfoJson["Global Quote"]);

      const overviewInfoJson = await overview.json();
      console.log(overviewInfoJson);
      setOverviewInfo(overviewInfoJson);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHints = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=${API_KEY}`
      );
      const json = await response.json();
      console.log(json);
      setHints(json.bestMatches);
    } catch (error) {
      console.log(error);
    }
  }, [inputValue]);

  return (
    <AppWrapper>
      <SearchBar
        inputValue={inputValue}
        changeInputValue={handleOnChange}
        clearInputValue={clearInputValue}
        hints={hints}
        setHints={setHints}
        fetchHints={fetchHints}
        fetchData={fetchData}
        setInputValue={setInputValue}
      />
      {globalInfo && (
        <InfoGraph graphData={graphData} globalInfo={globalInfo} />
      )}
      {overviewInfo && <CompanyOverview overviewInfo={overviewInfo} />}
    </AppWrapper>
  );
}

export default App;
