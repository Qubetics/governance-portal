import toast from "react-hot-toast";
import { useContext, useState } from "react";
import { UserContext } from "../../Context/store";
import { CHAIN_INFO, CONST } from "../../Common/constants";
import { sendMsgs } from "../../Common/Utility/sendMsgs";
// import CustomInput from "../../Common/Input/CustomInput";
import { simulateMsgs } from "../../Common/Utility/simulateMsgs";
import {
  calculateTimeRemaining,
  formatDate,
  getBalance,
  getWalletProvider,
} from "../../Common/Utility";
import { MsgVote } from "../../proto-types-gen/src/cosmos/gov/v1beta1/tx";
import { InfoIcon, Logo } from "../../Common/assets/StoreAsset/StoreAsset";

function SelectModal(props: any) {
  const [btnDisable, setBtnDisable] = useState(true);
  const { walletAddress } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState<null | number>(null);
  const { data, close } = props;

  async function handleOptions(e: any) {
    const name = e.target.name;
    let option: number;

    switch (name) {
      case "yes":
        option = 1;
        setBtnDisable(false);
        break;

      case "no":
        option = 3;
        setBtnDisable(false);
        break;

      case "abstain":
        option = 2;
        setBtnDisable(false);
        break;

      case "veto":
        option = 4;
        setBtnDisable(false);
        break;

      default:
        option = 0;
        setBtnDisable(true);
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

      if (!walletAddress) {
        toast.error("Please connect to wallet!");
        return;
      }

      const balance = await getBalance(walletAddress);
      if (!Number(balance ?? 0)) {
        toast.error("Insufficient funds");
        return;
      }

      setBtnDisable(true);
      const provider = getWalletProvider();
      const key = await provider.getKey(CHAIN_INFO.chainId);
      const protoMsgs = {
        typeUrl: "/cosmos.gov.v1beta1.MsgVote",
        value: MsgVote.encode({
          proposalId: `${data?.proposalId}`,
          voter: walletAddress as string,
          option: selectedOption ?? 0,
        }).finish(),
      };

      const gasFeeRes: any = await simulateMsgs(
        CHAIN_INFO,
        key.bech32Address,
        [protoMsgs],
        [
          {
            denom: CONST.currency.toLowerCase(),
            amount: "236",
          },
        ],
      );

      if (gasFeeRes?.error) {
        if (
          typeof gasFeeRes?.data === "string" &&
          gasFeeRes?.data.includes("unrecognized/unsupported public key type")
        ) {
          throw new Error(
            "You’ll need to register yourself on the Qubetics network first",
          );
        } else {
          throw new Error("Something went wrong!");
        }
      } else {
        const provider = getWalletProvider();
        await sendMsgs(provider, CHAIN_INFO, key.bech32Address, [protoMsgs], {
          amount: [
            {
              denom: CONST.currency.toLowerCase(),
              amount: "236",
            },
          ],
          gas: Math.floor(Number(gasFeeRes?.gasUsed ?? 0) * 1.8).toString(),
        });
        toast.success("Vote successfully");
      }
    } catch (e: any) {
      console.log("error while voting: ", e);

      toast.error(e.message ?? "Something went wrong!");
    }
    close();
    setSelectedOption(null);
    setBtnDisable(false);
  }

  return (
    <div className="selectOptionModal">
      <p className="selectOptionModal_infoData">
        <InfoIcon />
        It will take 1 transactions
      </p>
      <h3>{process.env?.REACT_APP_PROJECT_NAME ?? ""}</h3>
      {/* <Logo /> */}
      <div className="selectOptionModal_whitelist">
        <div>
          <h4>
            #{data?.proposalId}. <span>{data?.title}</span>
          </h4>
          <p>
            <span> {formatDate(data?.votingEndTime)}</span>
            <span>
              {" "}
              ({calculateTimeRemaining(new Date(), data?.votingEndTime) ??
                0}{" "}
              remaining)
            </span>
          </p>
        </div>
      </div>
      <div className="selectOptionModal_buttons multioptionBtn">
        <button
          className={`grayBtn ${selectedOption === 1 ? "borderBlue" : ""}`}
          name="yes"
          onClick={handleOptions}
          value="yes"
        >
          Yes
        </button>
        <button
          className={`grayBtn ${selectedOption === 3 ? "borderBlue" : ""}`}
          name="no"
          onClick={handleOptions}
          value="no"
        >
          No
        </button>
        <button
          className={`grayBtn  ${selectedOption === 4 ? "borderBlue" : ""}`}
          name="veto"
          onClick={handleOptions}
          value="veto"
        >
          Veto
        </button>
        <button
          className={`grayBtn  ${selectedOption === 2 ? "borderBlue" : ""}`}
          name="abstain"
          onClick={handleOptions}
          value="abstain"
        >
          Abstain
        </button>
      </div>
      {/* <div className="selectOptionModal_optionalMemo">
        <h4>Memo (Optional)</h4>
        <CustomInput id="lname" name="lastname" placeholder="Enter memo" />
      </div> */}
      <div className="selectOptionModal_voteBtn">
        <button
          disabled={btnDisable}
          className="commonBtn"
          onClick={handleVote}
        >
          Vote
        </button>
      </div>
    </div>
  );
}

export default SelectModal;
