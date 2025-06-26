import React from "react";
const CreateProposalCard = (props: any) => {
  const { data } = props;
  function renderData(action: string, days: string, key: string) {
    return (
      <div className="innerCardDes" key={key}>
        <p>{action}</p>
        <h5>{days}</h5>
      </div>
    );
  }
  return (
    <div className="createProposalCard">
      {data.length > 0 &&
        data.map((val: any, i: number) =>
          renderData(val.action, val.days, i + "createProposalCard")
        )}
    </div>
  );
};

export default CreateProposalCard;
