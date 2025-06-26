import { CONST } from "../../Common/constants";
import "./Description.scss";

const DescriptionCard = (props: any) => {
  const { data } = props;
  function renderData(action: string, balance: string, percentage: string, key: any, className: string, border: boolean) {
    let classname = ""
    if (border) {
      switch (className) {
        case "red":
          classname = "redBorder"
          break;

        case "pink":
          classname = "pinkBorder"
          break;
        case "green":
          classname = "greenBorder"
          break;

        default:
          classname = "greyBorder"
          break;
      }

    }

    return (
      <div className={"innerCardDes " + classname} key={key}>
        <p className={className} >{action}</p>
        <div className="rightDetail">
          <p>{percentage ? `${percentage}%` : ""}</p>
          <p>{balance} {CONST.currency}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="descriptionCard">
      {data.length > 0 &&
        data.map((val: any, i: number | string) =>
          renderData(val.action, val.balance, val.percentage, i + 'descriptionCard', val.className, val.border)
        )}
    </div>
  );
};

export default DescriptionCard;
