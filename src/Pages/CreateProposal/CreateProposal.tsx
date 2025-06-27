import { Input } from "antd";
import "./CreateProposal.scss";
import toast from "react-hot-toast";
import { Dec } from "@keplr-wallet/unit";
import { useContext, useState } from "react";
import keplr from "../../Common/assets/keplr.svg";
import { UserContext } from "../../Context/store";
import { httpReqest } from "../../Common/httpRequest";
import CreateProposalCard from "./CreateProposalCard";
import { sendMsgs } from "../../Common/Utility/sendMsgs";
import CustomInput from "../../Common/Input/CustomInput";
import { CHAIN_INFO, CONST } from "../../Common/constants";
import BackButton from "../../Common/BackButton/BackButton";
import CommonModal from "../../Common/commonModal/CommonModal";
import { simulateMsgs } from "../../Common/Utility/simulateMsgs";
import { TextProposal } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import { MsgSubmitProposal } from "cosmjs-types/cosmos/gov/v1beta1/tx";
import { CopyIcon } from "../../Common/assets/StoreAsset/StoreAsset";
import logo from "../../logo.svg"
import {
  convertSeconds,
  copyToClipBoard,
  noExponent,
} from "../../Common/Utility";

function CreateProposal() {
  const [keplrModalOpen, setkeplrModalOpen] = useState(false);
  const [propData, setPropData] = useState({
    title: "",
    description: "",
    deposit: "",
  });
  const [errMsg, setErrMsg] = useState({
    title: "",
    description: "",
    deposit: "",
  });
  const {
    isWallet,
    walletBalance,
    walletAddress,
    setWalletAddress,
    setWalletBalance,
    votingWidgetsData,
  } = useContext(UserContext);

  const { TextArea } = Input;
  function handleInput(e: any) {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "deposit") {
      const regex = /^(\d{1,20}(\.\d{0,18})?|\.\d{1,18})$/;
      if (value === "" || regex.test(value)) {
        setPropData({
          ...propData,
          [name]: value,
        });
      }
    } else {
      setPropData({
        ...propData,
        [name]: value,
      });
    }
    setErrMsg({ ...errMsg, [name]: "" });
  }

  function inputValidation() {
    let error = false;
    // const regex = /^[a-zA-Z0-9 ]*$/;
    const regex = /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|_-]*$/;

    const minimumDeposite = votingWidgetsData?.params?.min_deposit[0]?.amount
      ? +votingWidgetsData?.params?.min_deposit[0]?.amount / 10 ** 18
      : 0;

    const msg = {
      description: "",
      title: "",
      deposit: "",
    };
    if (!propData?.description) {
      msg.description = "Please enter description";
      error = true;
    } else if (!regex.test(propData.description)) {
      msg.description = `@#$%^&*(),.?":{}|_- Only These Special characters are allowed`;
      error = true;
    }

    if (!propData?.title) {
      msg.title = "Please enter title";
      error = true;
    } else if (!regex.test(propData.title)) {
      msg.title = `@#$%^&*(),.?":{}|_- Only These Special characters are allowed`;
      error = true;
    }

    if (!propData?.deposit) {
      msg.deposit = "Please enter deposit amount";
      error = true;
    } else if (+propData?.deposit < minimumDeposite) {
      msg.deposit = `Minimum deposit amount is ${noExponent(
        minimumDeposite
      )}. Please enter a higher amount.`;
      error = true;
    } else if (+propData?.deposit > Number(walletBalance ?? 0)) {
      msg.deposit = `Insufficient funds`;
      error = true;
    }

    setErrMsg(msg);
    return error;
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleCreateProposal();
    }
  };

  async function handleCreateProposal() {
    try {
      if (!walletAddress) {
        toast.error("Please connect to wallet!");
        return;
      }

      console.log("walletBalance: ", walletBalance);
      
      if (!walletBalance) {
        toast.error("Insufficient funds!");
        return;
      }
      if (!inputValidation()) {
        const win: any = window;
        const key = await win.keplr.getKey(CHAIN_INFO.chainId);
        const title = propData?.title.trim();
        const description = propData?.description.trim();

        const value = {
          title: title[0].toUpperCase() + title.slice(1),
          description: description[0].toUpperCase() + description.slice(1),
        };

        const sendMsg: any = {
          typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
          value: MsgSubmitProposal.encode({
            content: {
              typeUrl: "/cosmos.gov.v1beta1.TextProposal",
              value: TextProposal.encode(value).finish(),
            },
            initialDeposit: [
              {
                denom: CONST.currency.toLowerCase(),
                amount: `${Number(propData?.deposit) * 10 ** 18}`,
              },
            ],
            proposer: key.bech32Address,
          }).finish(),
        };

        const gasUsed = await simulateMsgs(
          CHAIN_INFO,
          key.bech32Address,
          [sendMsg],
          [
            {
              denom: CONST.currency.toLowerCase(),
              amount: "100000000",
            },
          ]
        );

        console.log("gassUsed------", gasUsed);

        if (gasUsed) {
          await sendMsgs(win.keplr, CHAIN_INFO, key.bech32Address, [sendMsg], {
            amount: [
              {
                denom: CONST.currency.toLowerCase(),
                amount: "100000000",
              },
            ],
            gas: Math.floor(gasUsed * 1.5).toString(),
          });
          toast.success("Proposal created successfully");
        } else {
          throw new Error("Something went wrong!");
        }
        setPropData({
          title: "",
          description: "",
          deposit: "",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error?.message ?? "Something went wrong!");
      } else {
        toast.error("Something went wrong!");
      }
      console.log("error while creating proposal : ", error);
    }
  }

  const handleKeplrModal = () => {
    setkeplrModalOpen(!keplrModalOpen);
  };

  function connectWallet() {
    console.log("isWallet : ", isWallet);

    if (isWallet) {
      const getKeyFromKeplr = async () => {
        try {
          const win: any = window;
          const key = await win.keplr?.getKey(CHAIN_INFO.chainId);
          console.log("key : ", key);

          if (key) {
            setWalletAddress(key.bech32Address);
            toast.success("Successfully connected with Keplr wallet.");
          }
        } catch (error) {
          toast.error("Please add chain id to your wallet.");
        }
      };

      const getBalance = async () => {
        try {
          const win: any = window;
          const key = await win.keplr?.getKey(CHAIN_INFO.chainId);

          if (key) {
            const uri = `${CHAIN_INFO.rest}/cosmos/bank/v1beta1/balances/${key.bech32Address}?pagination.limit=1000`;
            const data = await httpReqest(uri, "GET", null);

            if (data) {
              const balance = data?.data?.balances.find(
                (balance: any) =>
                  balance.denom ===
                  (CHAIN_INFO?.stakeCurrency?.coinDenom ?? "").toLowerCase()
              );
              const decimal = CHAIN_INFO.currencies.find(
                (currency) =>
                  currency.coinMinimalDenom ===
                  CHAIN_INFO.stakeCurrency?.coinMinimalDenom
              )?.coinDecimals;

              if (balance) {
                const amount = new Dec(balance?.amount, Number(decimal ?? 0));
                setWalletBalance(`${amount.toString(Number(decimal))}`);
              } else {
                setWalletBalance(0);
              }
            } else {
              setWalletBalance(0);
            }
          }
        } catch (error) {
          console.log("error while fetching balance from keplr : ", error);
          setWalletBalance(0);
        }
      };

      getKeyFromKeplr();
      getBalance();
      handleKeplrModal();
    } else {
      toast.error("Please install keplr extension");
    }
  }

  const data = [
    {
      action: "Min Deposit",
      days: `${
        noExponent(
          votingWidgetsData?.params?.min_deposit[0]?.amount
            ? votingWidgetsData?.params?.min_deposit[0]?.amount / 10 ** 18
            : 0
        ) ?? "-"
      } ${CONST.currency}`,
    },
    {
      action: "Max Deposit Period",
      days: `${
        convertSeconds(
          votingWidgetsData?.params?.max_deposit_period
            ? votingWidgetsData?.params?.max_deposit_period.split("s")[0]
            : 0
        ) ?? 0
      }`,
    },
    {
      action: "Voting Period",
      days: `${convertSeconds(
        votingWidgetsData?.voting_params?.voting_period
          ? votingWidgetsData?.voting_params?.voting_period.split("s")[0]
          : 0
      )}`,
    },
    {
      action: "Quorum",
      days: `${
        votingWidgetsData?.params?.quorum
          ? votingWidgetsData?.params?.quorum * 100
          : 0
      }%`,
    },
    {
      action: "Threshold",
      days: `${
        votingWidgetsData?.params?.threshold
          ? votingWidgetsData?.params?.threshold * 100
          : 0
      }%`,
    },
    {
      action: "Veto Threshold",
      days: `${
        votingWidgetsData?.params?.veto_threshold
          ? votingWidgetsData?.params?.veto_threshold * 100
          : 0
      }%`,
    },
  ];

  return (
    <>
      <div className="createProposal" onKeyDown={handleKeyDown}>
        <div className="container">
          <BackButton />
          <h2 className="cardHeading">Create Proposal</h2>
          <div className="cosmosSec">
            <div className="cosmosSec_inner">
              <div className="imgSec">
                <img src={logo} alt="" />
              </div>
              <div className="cosMosDeatil">
                <h2>{CONST.chainName.toUpperCase()}</h2>
                <p>
                  {walletAddress ? (
                    <>
                      {walletAddress}
                      &nbsp;
                      <span
                        className="pointer"
                        onClick={() => copyToClipBoard(walletAddress ?? "")}
                      >
                        <CopyIcon />
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
            {!walletAddress && (
              <button className=" commonBtn" onClick={handleKeplrModal}>
                Connect Wallet
              </button>
            )}
          </div>

          <div className="createContents">
            <h2 className="cardHeading">Contents</h2>
            <div className="innerContents">
              <div className="versionCard">
                <div className="left">
                  <h4>Gov Version</h4>
                  {/* <span>{"v1 >"}</span> */}
                  <CustomInput
                    disable={true}
                    id="lname"
                    name="lastname"
                    placeholder="v1 >"
                  />
                </div>
              </div>

              <div className="ipfCard">
                <h5>Proposal Title</h5>
                <CustomInput
                  value={propData.title}
                  onChange={handleInput}
                  id="lname"
                  name="title"
                  placeholder="Enter proposal title"
                />
                <p className="red"> {errMsg?.title}</p>
              </div>
              <div className="ipfCard">
                <h5>Proposal Description</h5>
                <TextArea
                  rows={4}
                  onKeyDown={(e) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                  value={propData.description}
                  onChange={handleInput}
                  id="lname"
                  name="description"
                  placeholder="Enter proposal description"
                />
                <p className="red">{errMsg?.description}</p>
              </div>
              <div className="ipfCard">
                <h5>Initial Deposit</h5>
                <CustomInput
                  value={propData.deposit}
                  onChange={handleInput}
                  id="lname"
                  name="deposit"
                  placeholder="Enter deposit"
                />
                <p className="red">{errMsg?.deposit}</p>
              </div>
              {/* <div className="ipfCard">
              <h5>Forum</h5>
              <CustomInput id="lname" name="lastname" placeholder="ipfs://" />
            </div>
            <div className="ipfCard">
            <h5>Additional Link</h5>
            <CustomInput id="lname" name="lastname" placeholder="ipfs://" />
            </div> */}
              {/* <div className="ipfCard">
              <h5>Additional Info</h5>
              <CustomInput id="lname" name="lastname" placeholder="ipfs://" />
            </div> */}
              <div className="governanceHeading">
                <h2>Governance Parameters</h2>
              </div>
              <CreateProposalCard data={data} />
              <div className="createProposalMultiBtn">
                {/* <button className="commonBtn">Preview</button> */}
                <button className="commonBtn" onClick={handleCreateProposal}>
                  Create Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommonModal
        visible={keplrModalOpen}
        onClose={handleKeplrModal}
        title="Connect Wallet"
        content={
          <div className="keplerContent" onClick={connectWallet}>
            <img src={keplr} alt="keplr" />
            <div style={{ cursor: "pointer" }}>
              <h4>keplr</h4>
              <p>
                If you use Keplr Wallet, you will have access to all features
              </p>
            </div>
          </div>
        }
      />
    </>
  );
}

export default CreateProposal;
