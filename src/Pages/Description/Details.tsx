import DetailsCard from "./DetailsCard";
import { formatDate } from "../../Common/Utility";
import { CONST } from "../../Common/constants";

function Details(props: any) {
  const { data } = props;
  const cardData = [
    {
      cardname: "Voting Start",
      balance: formatDate(data?.votingStartTime) ?? "",
    },
    {
      cardname: "Voting End",
      balance: formatDate(data?.votingEndTime) ?? "",
    },
    {
      cardname: "Total Deposit",
      balance: data?.totalDeposit ? `${data.totalDeposit} ${CONST.currency}` : "",
    },
    {
      cardname: "Proposer",
      balance: data?.proposer ?? "",
      copyBtn: true
    },
  ];
  return (
    <div className="detailsSec">
      <DetailsCard data={cardData} />
    </div>
  );
}

export default Details;
