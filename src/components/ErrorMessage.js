import styled, { css } from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -250%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;
  background: linear-gradient(to bottom left, #ef8d9c 40%, #ffc39e 100%);
  border-radius: 20px;
  box-shadow: 5px 5px 20px rgb(203 205 211 / 10%);
  transition: transform 0.5s ease;

  ${({ isVisible }) =>
    isVisible &&
    css`
      transform: translate(-50%, -50%);
    `}
`;

const Message = styled.p`
  margin-bottom: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 5px;
`;

const SmallMessage = styled.p`
  color: #5e5e5e;
  font-size: 10px;
  letter-spacing: 1px;
`;

const CloseBtn = styled.button`
  margin-top: 20px;
  width: 130px;
  height: 35px;
  color: #e96075;
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  border-radius: 20px;
  box-shadow: 2px 2px 10px rgb(119 119 119 / 50%);
  border: none;
  outline: transparent;
`;

function ErrorMessage({ closeErrorMessage, errorMessageIsVisible }) {
  return (
    <Wrapper isVisible={errorMessageIsVisible}>
      <Message>ERROR !</Message>
      <SmallMessage>oh no, something went wrong.</SmallMessage>
      <CloseBtn onClick={closeErrorMessage}>Try again</CloseBtn>
    </Wrapper>
  );
}

export default ErrorMessage;
