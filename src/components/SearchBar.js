import { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import searchIcon from "assets/search-icon.svg";
import deleteIcon from "assets/times-circle.svg";

const Form = styled.form`
  position: relative;
  width: 360px;
  background-color: #f2f2f2;
  border-radius: 10px;

  @media (min-width: 576px) {
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

function SearchBar({
  inputValue,
  changeInputValue,
  clearInputValue,
  hints,
  setHints,
  fetchData,
}) {
  const [visibleClearButton, setVisibleClearButton] = useState(false);

  const handleOnClick = (e) => {
    e.preventDefault();
    clearInputValue();
    setVisibleClearButton(false);
  };

  const handleOnClickHint = (e) => {};

  const handleOnSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    if (inputValue.length) {
      setVisibleClearButton(true);
    } else {
      setVisibleClearButton(false);
      setHints([]);
    }
  }, [inputValue, setHints]);
  return (
    <Form onSubmit={handleOnSubmit}>
      <InputWrapper>
        <SearchInput
          type="text"
          value={inputValue}
          onChange={changeInputValue}
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
