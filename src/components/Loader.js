import styled, { keyframes } from "styled-components";

const Spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Test = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(3px);
`;

const Wrapper = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-bottom: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${Spin} 2s linear infinite;
`;

function Loader() {
  return (
    <Test>
      <Wrapper></Wrapper>
    </Test>
  );
}

export default Loader;
