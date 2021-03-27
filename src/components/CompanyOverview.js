import styled from "styled-components";

const SectionWrapper = styled.section`
  margin-top: 50px;
  padding: 0 15px;
  max-width: 850px;

  @media (min-width: 576px) {
    padding: 0 50px;
  }

  @media (min-width: 992px) {
    padding: 0;
    padding-left: 100px;
  }
`;

const Heading = styled.h2`
  padding: 10px 0;
  font-size: 22px;
  font-weight: 400;
  border-bottom: 1px solid #0090d5;

  @media (min-width: 576px) {
    font-size: 27px;
  }

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const InfoTable = styled.table`
  margin: 30px 0;
  width: 100%;
`;

const InfoTitle = styled.td`
  padding: 9px 0;
  color: #888;
  font-size: 11px;
  border-bottom: 1px dotted #0090d5;
`;

const InfoValue = styled.td`
  padding: 9px 15px 9px 65px;
  font-size: 13px;
  border-bottom: 1px dotted #0090d5;
`;

const DescriptionWrapper = styled.p`
  margin-top: 20px;
  padding-bottom: 30px;
  color: #909090;
  font-size: 14px;
  line-height: 20px;

  @media (min-width: 576px) {
    padding-bottom: 50px;
  }
`;

function CompanyOverview({ overviewInfo }) {
  const {
    Address,
    Country,
    Currency,
    Description,
    Exchange,
    FullTimeEmployees,
    Industry,
    MarketCapitalization,
    Name,
    Sector,
    Symbol,
  } = overviewInfo || {};

  const dataArray = [
    {
      title: "Symbol",
      value: Symbol,
    },
    {
      title: "Name",
      value: Name,
    },
    {
      title: "Address",
      value: Address,
    },
    {
      title: "Country",
      value: Country,
    },
    {
      title: "Currency",
      value: Currency,
    },
    {
      title: "Exchange",
      value: Exchange,
    },
    {
      title: "Market capitalization",
      value: MarketCapitalization,
    },
    {
      title: "Industry",
      value: Industry,
    },
    {
      title: "Sector",
      value: Sector,
    },
    {
      title: "Full time employees",
      value: FullTimeEmployees,
    },
  ];
  return (
    <SectionWrapper>
      <header>
        <Heading>
          {Name} {Symbol ? `(${Symbol})` : "n/a"}
        </Heading>
      </header>
      <InfoTable>
        <tbody>
          {dataArray?.map(({ title, value }, index) => (
            <tr key={index}>
              <InfoTitle>{title}:</InfoTitle>
              <InfoValue>{value ?? "n/a"}</InfoValue>
            </tr>
          ))}
        </tbody>
      </InfoTable>
      <Heading>About Company</Heading>
      <DescriptionWrapper>{Description ?? "no description"}</DescriptionWrapper>
    </SectionWrapper>
  );
}

export default CompanyOverview;
