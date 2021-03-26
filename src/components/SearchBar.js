import { useState, useEffect, useRef, useCallback } from "react";
import styled, { css } from "styled-components";

import searchIcon from "assets/search-icon.svg";
import deleteIcon from "assets/times-circle.svg";

const Form = styled.form`
  position: relative;
  margin-top: 30px;
  width: 360px;
  background-color: #f2f2f2;
  border-radius: 10px;

  @media (min-width: 576px) {
    margin-left: 50px;
    width: 450px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-right: 10px;
`;

const SearchInput = styled.input`
  padding: 10px 10px 10px 50px;
  width: 100%;
  background-color: transparent;
  background-image: url(${searchIcon});
  background-size: 30px;
  background-repeat: no-repeat;
  background-position: 10px center;
  font-size: 30px;
  text-transform: uppercase;
  border: none;
  outline: transparent;
`;

const ClearBtn = styled.button`
  display: none;
  width: 25px;
  height: 25px;
  background-image: url(${deleteIcon});
  background-size: 25px;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  border-radius: 50%;

  ${({ isVisible }) =>
    isVisible &&
    css`
      display: block;
    `}
`;

const HintsList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
`;

const HintWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 2px solid #e8e8e8;
`;

const CompanySymbol = styled.span`
  font-weight: 700;
`;

const CompanyName = styled.p`
  max-width: 50%;
  text-align: right;
`;

let timeout;

function SearchBar({
  inputValue,
  changeInputValue,
  clearInputValue,
  hints,
  setHints,
  fetchHints,
  fetchData,
  setInputValue,
  stopFetchHints,
}) {
  const [visibleClearButton, setVisibleClearButton] = useState(false);

  const inputRef = useRef();
  const { current } = inputRef;

  const handleOnClick = (e) => {
    e.preventDefault();
    clearInputValue();
    setVisibleClearButton(false);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const symbolFromInput = e.target.elements[0].value.toUpperCase();
    fetchData(symbolFromInput);
    stopFetchHints();
  };

  const handleOnClickHint = (e) => {
    const symbol = e.target.firstChild.textContent;
    setInputValue(symbol);
    fetchData(symbol);
  };

  const throttlingFetchHints = useCallback(() => {
    if (inputValue.length > 3) {
      fetchHints();
    }
  }, [inputValue.length, fetchHints]);

  const timeOutFetch = useCallback(() => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(throttlingFetchHints, 5000);
  }, [throttlingFetchHints]);

  useEffect(() => {
    if (inputValue.length) {
      setVisibleClearButton(true);
    } else {
      setVisibleClearButton(false);
      setHints([]);
    }

    current?.addEventListener("keypress", timeOutFetch);

    return () => current?.removeEventListener("keypress", timeOutFetch);
  }, [inputValue, setHints, throttlingFetchHints, timeOutFetch, current]);
  return (
    <Form onSubmit={handleOnSubmit}>
      <InputWrapper>
        <SearchInput
          type="text"
          value={inputValue}
          onChange={changeInputValue}
          ref={inputRef}
        />
        <ClearBtn
          onClick={handleOnClick}
          isVisible={visibleClearButton}
          type="button"
        />
      </InputWrapper>
      <HintsList>
        {hints?.map((hint, index) => (
          <HintWrapper key={index} onClick={handleOnClickHint}>
            <CompanySymbol>{hint["1. symbol"]}</CompanySymbol>
            <CompanyName>{hint["2. name"]}</CompanyName>
          </HintWrapper>
        ))}
      </HintsList>
    </Form>
  );
}

export default SearchBar;
