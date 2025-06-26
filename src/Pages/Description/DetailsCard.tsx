import "./Description.scss";
import { copyToClipBoard, formatString } from "../../Common/Utility";
import { CopyIcon } from "../../Common/assets/StoreAsset/StoreAsset";

const DetailsCard = (props: any) => {
  const { data } = props;
  function renderData(cardname: string, balance: string, copyBtn: boolean, key: string) {

    return (
      <div className="innerCardDes" key={key}>
        <p>{cardname}</p>
        <h2>{cardname === "Proposer" ? formatString(balance, 15, 15) : balance}
        &nbsp;
          {
            copyBtn &&
            <span className="pointer" onClick={() => (copyToClipBoard(balance ?? ''))}>
              <CopyIcon />
            </span>
          }
        </h2>
      </div>
    );
  }
  return (
    <div className="detailCard">
      {data.length > 0 &&
        data.map((val: any, i: number) => renderData(val.cardname, val.balance, val?.copyBtn ?? false, i + "detailCard"))}
    </div>
  );
};

export default DetailsCard;
