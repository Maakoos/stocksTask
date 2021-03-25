import { Line } from "react-chartjs-2";
import styled, { css } from "styled-components";

const SectionWrapper = styled.section`
  margin-top: 50px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  padding: 0 10px;

  @media (min-width: 992px) {
    flex-direction: row;
    align-items: flex-start;
  }

  @media (min-width: 1200px) {
    padding: 0 50px;
  }
`;

const GraphWrapper = styled.div`
  width: 100%;
  @media (min-width: 992px) {
    width: 60%;
  }
`;

const InfoBox = styled.div`
  margin-top: 30px;

  @media (min-width: 992px) {
    margin-left: 30px;
  }

  @media (min-width: 1400px) {
    margin-left: 50px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 22px;

  ${({ small }) =>
    small &&
    css`
      font-size: 15px;
    `}
`;

const InfoTitle = styled.p`
  margin-right: 80px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 10px;
  background-color: #e6e6e6;

  @media (min-width: 768px) {
    padding: 15px 50px;
  }

  @media (min-width: 1200px) {
    padding: 15px 100px;
  }
`;

const CompanySymbol = styled.h1`
  font-size: 18px;
  font-weight: 500;

  @media (min-width: 576px) {
    font-size: 25px;
  }
`;

const Price = styled.span`
  margin-left: auto;
  font-size: 18px;

  @media (min-width: 576px) {
    font-size: 25px;
  }

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const ChangePercent = styled.span`
  margin: 0 10px;
  color: #00944d;
  font-size: 18px;
  font-weight: 700;

  @media (min-width: 576px) {
    margin: 0 20px;
    font-size: 25px;
  }

  @media (min-width: 768px) {
    font-size: 32px;
  }

  ${({ isNegative }) =>
    isNegative &&
    css`
      color: #f40000;
    `}
`;

const MinMaxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 10px;

  @media (min-width: 576px) {
    font-size: 13px;
  }
`;

function InfoGraph({ graphData, globalInfo }) {
  const price = globalInfo["05. price"];
  const formattedPrice = parseFloat(price);
  const formattedPercentages = globalInfo["10. change percent"];
  const formattedMinValue = parseFloat(globalInfo["04. low"]).toFixed(2);
  const formattedMaxValue = parseFloat(globalInfo["03. high"]).toFixed(2);
  const volumen = globalInfo["06. volume"];
  const openingRate = globalInfo["02. open"];
  const closingRate = globalInfo["08. previous close"];
  const symbol = globalInfo["01. symbol"];

  const sliced = Object.fromEntries(Object.entries(graphData).slice(0, 20));

  const priceArray = [];
  const volumensArray = [];
  const date = [];
  for (const [key, v] of Object.entries(sliced)) {
    date.push(key.slice(-5));
    for (const [key, value] of Object.entries(v)) {
      if (key === "2. high") {
        priceArray.push(value);
      } else if (key === "5. volume") {
        volumensArray.push(value);
      }
    }
  }
  priceArray.reverse();
  volumensArray.reverse();
  date.reverse();

  const data = {
    labels: [...date],
    datasets: [
      {
        label: "value",
        data: [...priceArray],
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y-axis-1",
      },
      {
        label: "volumen",
        data: [...volumensArray],
        fill: false,
        backgroundColor: "rgb(54, 162, 235)",
        borderColor: "rgba(54, 162, 235, 0.5)",
        yAxisID: "y-axis-2",
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
        },
        {
          type: "linear",
          display: true,
          position: "right",
          id: "y-axis-2",
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
  };

  return (
    <SectionWrapper>
      <SectionHeader>
        <CompanySymbol>({symbol})</CompanySymbol>
        <Price>{formattedPrice}</Price>
        <ChangePercent isNegative={formattedPercentages.startsWith("-")}>
          {formattedPercentages}
        </ChangePercent>
        <MinMaxWrapper>
          <span>min {formattedMinValue}</span>
          <span>max {formattedMaxValue}</span>
        </MinMaxWrapper>
      </SectionHeader>
      <ContentWrapper>
        <GraphWrapper>
          <Line data={data} options={options} />
        </GraphWrapper>
        <InfoBox>
          <InfoItem>
            <InfoTitle>Purchase offer</InfoTitle>
            <span>{price}</span>
          </InfoItem>

          <InfoItem>
            <InfoTitle>Sale offer</InfoTitle>
            <span>{price}</span>
          </InfoItem>

          <InfoItem small>
            <InfoTitle>Trading volume (quan)</InfoTitle>
            <span>{volumen}</span>
          </InfoItem>

          <InfoItem small>
            <InfoTitle>Opening rate</InfoTitle>
            <span>{openingRate}</span>
          </InfoItem>

          <InfoItem small>
            <InfoTitle>Closing rate</InfoTitle>
            <span>{closingRate}</span>
          </InfoItem>
        </InfoBox>
      </ContentWrapper>
    </SectionWrapper>
  );
}

export default InfoGraph;
