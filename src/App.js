import { useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";

import SearchBar from "components/SearchBar";
import InfoGraph from "components/InfoGraph";
import CompanyOverview from "components/CompanyOverview";
import ErrorMessage from "components/ErrorMessage";

const API_KEY = process.env.REACT_APP_API_KEY;
export const DAILY = "DAILY";
export const MONTHLY = "MONTHLY";

const AppWrapper = styled.div`
  max-width: 1650px;
  margin: 0 auto;
`;

let timeout;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [hints, setHints] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [globalInfo, setGlobalInfo] = useState(null);
  const [overviewInfo, setOverviewInfo] = useState();
  const [monthlyGraphData, setMonthlyGraphData] = useState({});
  const [errorMessageIsVisible, setErrorMessageIsVisible] = useState(false);
  const [timelineValue, setTimelineValue] = useState(7);
  const [timeline, setTimeline] = useState(DAILY);

  const inputRef = useRef();
  const { current } = inputRef;

  const handleOnChange = (e) => setInputValue(e.target.value);

  const clearInputValue = () => setInputValue("");

  const closeErrorMessage = () => setErrorMessageIsVisible(false);

  const changeTimelineValue = (value) => setTimelineValue(value);

  const changeTimeline = (value) => setTimeline(value);

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
      current.blur();
      const json = await graph.json();

      const size = Object.keys(json).length;

      if (size > 1) {
        setTimeline(DAILY);
        setGraphData(json["Time Series (Daily)"]);

        const graphMonthJson = await graphMonth.json();
        setMonthlyGraphData(graphMonthJson["Monthly Time Series"]);

        const globalInfoJson = await globalInfo.json();
        setGlobalInfo(globalInfoJson["Global Quote"]);

        const overviewInfoJson = await overview.json();
        setOverviewInfo(overviewInfoJson);
      } else {
        setErrorMessageIsVisible(true);
      }

      setHints([]);
      setTimelineValue(7);
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
      setHints(json.bestMatches);
    } catch (error) {
      console.log(error);
    }
  }, [inputValue]);

  const throttlingFetchHints = useCallback(() => {
    if (inputValue.length > 2) {
      fetchHints();
    }
  }, [inputValue.length, fetchHints]);

  const timeOutFetch = useCallback(() => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(throttlingFetchHints, 2000);
  }, [throttlingFetchHints]);

  useEffect(() => {
    current?.addEventListener("keypress", timeOutFetch);

    return () => current?.removeEventListener("keypress", timeOutFetch);
  }, [current, timeOutFetch]);

  return (
    <AppWrapper>
      <SearchBar
        inputValue={inputValue}
        changeInputValue={handleOnChange}
        clearInputValue={clearInputValue}
        hints={hints}
        setHints={setHints}
        fetchData={fetchData}
        setInputValue={setInputValue}
        stopFetchHints={stopFetchHints}
        inputRef={inputRef}
      />
      {globalInfo && graphData && monthlyGraphData && (
        <InfoGraph
          graphData={graphData}
          globalInfo={globalInfo}
          monthlyGraphData={monthlyGraphData}
          timelineValue={timelineValue}
          changeTimelineValue={changeTimelineValue}
          timeline={timeline}
          changeTimeline={changeTimeline}
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
