import "./Home.scss"

const ProposalsCard = (props: any) => {
  const { data } = props;
  function renderData(cardName: string, value: string, key: string) {
    return (
      <div className="innerCardPropsal" key={key}>
        <p>{cardName}</p>
        <h2>{value}</h2>
      </div>
    )
  }
  return (
    <div className="proposalCard">
      {data.length > 0 &&
        data.map((val: any, i: number) => (
          renderData(val.cardName, val.value, i + "proposalCard")
        ))}
    </div>
  );
};

export default ProposalsCard;
