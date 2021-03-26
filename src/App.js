import { useState, useCallback } from "react";
import styled from "styled-components";

import SearchBar from "components/SearchBar";
import InfoGraph from "components/InfoGraph";
import CompanyOverview from "components/CompanyOverview";
import ErrorMessage from "components/ErrorMessage";

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
  const [monthlyGraphData, setMonthlyGraphData] = useState({});
  const [errorMessageIsVisible, setErrorMessageIsVisible] = useState(false);

  const handleOnChange = (e) => setInputValue(e.target.value);

  const clearInputValue = () => setInputValue("");

  const closeErrorMessage = () => setErrorMessageIsVisible(false);

  const fetchData = async (symbol) => {
    try {
      let [graph, graphMonth, globalInfo, overview] = await Promise.all([
        fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        ),
        fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`
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

      const size = Object.keys(json).length;

      if (size > 1) {
        setGraphData(json["Time Series (Daily)"]);

        const graphMonthJson = await graphMonth.json();
        console.log(graphMonthJson);
        setMonthlyGraphData(graphMonthJson["Monthly Time Series"]);

        const globalInfoJson = await globalInfo.json();
        console.log(globalInfoJson);
        setGlobalInfo(globalInfoJson["Global Quote"]);

        const overviewInfoJson = await overview.json();
        console.log(overviewInfoJson);
        setOverviewInfo(overviewInfoJson);
      } else {
        setErrorMessageIsVisible(true);
      }

      setHints([]);
    } catch (error) {
      console.log(error);
    }
  };

  const controller = new AbortController();
  const signal = controller.signal;
  const stopFetchHints = () => controller.abort();

  const fetchHints = useCallback(async () => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=${API_KEY}`,
        { signal: signal }
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
        stopFetchHints={stopFetchHints}
      />
      {globalInfo && graphData && monthlyGraphData && (
        <InfoGraph
          graphData={graphData}
          globalInfo={globalInfo}
          monthlyGraphData={monthlyGraphData}
        />
      )}
      {overviewInfo && globalInfo && graphData && monthlyGraphData && (
        <CompanyOverview overviewInfo={overviewInfo} />
      )}
      <ErrorMessage
        closeErrorMessage={closeErrorMessage}
        errorMessageIsVisible={errorMessageIsVisible}
      />
    </AppWrapper>
  );
}

export default App;
