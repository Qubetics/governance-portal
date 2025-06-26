import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { calculateDaysRemaining, formatDate } from "../../Common/Utility";
import { UserContext } from "../../Context/store";
import { CHAIN_INFO, CONST } from "../../Common/constants";
import { sendMsgs } from "../../Common/Utility/sendMsgs";
// import CustomInput from "../../Common/Input/CustomInput";
import { simulateMsgs } from "../../Common/Utility/simulateMsgs";
import { MsgVote } from "../../proto-types-gen/src/cosmos/gov/v1beta1/tx";
import { InfoIcon, Logo } from "../../Common/assets/StoreAsset/StoreAsset";


function SelectModal(props: any) {
  const { walletAddress, walletBalance } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState<null | number>(null)
  const { data, close } = props;

  async function handleOptions(e: any) {

    const name = e.target.name;
    let option: number;

    switch (name) {
      case "yes":
        option = 1;
        break;

      case "no":
        option = 3;
        break;

      case "abstain":
        option = 2;
        break;

      case "veto":
        option = 4;
        break;

      default:
        option = 0;
        break;
    }

    setSelectedOption(option);

  }

  async function handleVote() {
    try {
      if (!selectedOption) {
        toast.error("Please Select Option!");
        return;
      }
      if (!walletBalance) {
        toast.error("Insufficient funds!");
        return;
      }
      const win: any = window;
      const key = await win.keplr.getKey(CHAIN_INFO.chainId);
      const protoMsgs = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: MsgVote.encode({
          proposalId: `${data?.proposalId}`,
          voter: walletAddress as string,
          option: selectedOption ?? 0,
        }).finish()
      }

      const gasUsed = await simulateMsgs(
        CHAIN_INFO,
        key.bech32Address,
        [protoMsgs],
        [{
          denom: CONST.chainName.toLowerCase(),
          amount: "236"
        }]
      );

      console.log("gasUsed=========", gasUsed);
      if (gasUsed) {
        const win: any = window
        const data = await sendMsgs(
          win.keplr,
          CHAIN_INFO,
          key.bech32Address,
          [protoMsgs],
          {
            amount: [{
              denom: CONST.chainName.toLowerCase(),
              amount: "236",
            }],
            gas: Math.floor(gasUsed * 1.8).toString(),
          });
        toast.success("Vote successfully");
      }
    } catch (e) {
      console.log("error while voting", e);
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
    close();
    setSelectedOption(null);
  }

  return (
    <div className="selectOptionModal">
      <p className="selectOptionModal_infoData">
        <InfoIcon />
        It will take 1 transactions
      </p>
      <h3>{process.env?.REACT_APP_PROJECT_NAME ?? "" }</h3>
      <div className="selectOptionModal_whitelist">
        <Logo />
        <div>
          <h4>
            #{data?.proposalId}. <span>{data?.title}</span>
          </h4>
          <p>
            <span> {formatDate(data?.votingEndTime)}</span>
            <span> ({calculateDaysRemaining(new Date(), data?.votingEndTime) ?? 0} days remaining)</span>
          </p>
        </div>
      </div>
      <div className="selectOptionModal_buttons multioptionBtn">
        <button className={`grayBtn ${selectedOption === 1 ? "borderBlue" : ""}`} name="yes" onClick={handleOptions} value="yes">Yes</button>
        <button className={`grayBtn ${selectedOption === 3 ? "borderBlue" : ""}`} name="no" onClick={handleOptions} value="no" >No</button>
        <button className={`grayBtn  ${selectedOption === 4 ? "borderBlue" : ""}`} name="veto" onClick={handleOptions} value="veto">Veto</button>
        <button className={`grayBtn  ${selectedOption === 2 ? "borderBlue" : ""}`} name="abstain" onClick={handleOptions} value="abstain">Abstain</button>
      </div>
      {/* <div className="selectOptionModal_optionalMemo">
        <h4>Memo (Optional)</h4>
        <CustomInput id="lname" name="lastname" placeholder="Enter memo" />
      </div> */}
      <div className="selectOptionModal_voteBtn">
        <button className="cmnBtn" onClick={handleVote}>Vote</button>
      </div>
    </div>
  );
}

export default SelectModal;
