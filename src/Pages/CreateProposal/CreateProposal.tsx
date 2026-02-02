import { Input } from "antd";
import "./CreateProposal.scss";
import toast from "react-hot-toast";
import { useContext, useState } from "react";
import keplr from "../../Common/assets/keplr.svg";
import cosmostation from "../../Common/assets/cosmostation.svg";
import { UserContext } from "../../Context/store";
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
import logo from "../../logo.svg";
import {
  convertSeconds,
  copyToClipBoard,
  ensureCosmostationConnected,
  ensureKeplrConnected,
  ensureQubeticsConnected,
  getBalance,
  getWalletProvider,
  noExponent,
} from "../../Common/Utility";
import { useNavigate } from "react-router-dom";

function CreateProposal() {
  const navigate = useNavigate();
  const [btnDisabled, setBtnDisabled] = useState(false);
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
    // walletBalance,
    walletAddress,
    setWalletAddress,
    setIsWallet,
    setWalletType,
    setEvmAddress,
    // setWalletBalance,
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
    } else if (propData?.description.length > 10000) {
      msg.description = "Only 10000 character allowed";
      error = true;
    }

    if (!propData?.title) {
      msg.title = "Please enter title";
      error = true;
    } else if (!regex.test(propData.title)) {
      msg.title = `@#$%^&*(),.?":{}|_- Only These Special characters are allowed`;
      error = true;
    } else if (propData?.title.length > 140) {
      msg.title = "Only 140 character allowed";
      error = true;
    }

    if (!propData?.deposit) {
      msg.deposit = "Please enter deposit amount";
      error = true;
    } else if (+propData?.deposit < minimumDeposite) {
      msg.deposit = `Minimum deposit amount is ${noExponent(
        minimumDeposite,
      )}. Please enter a higher amount.`;
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
      const balance = await getBalance(walletAddress);
      if (+propData?.deposit > Number(balance ?? 0)) {
        toast.error("Insufficient funds");
        return;
      }

      if (!inputValidation()) {
        setBtnDisabled(true);
        const provider = getWalletProvider();
        const key = await provider.getKey(CHAIN_INFO.chainId);
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
                amount: noExponent(Number(propData?.deposit) * 10 ** 18),
              },
            ],
            proposer: key.bech32Address,
          }).finish(),
        };

        const gasFeeRes: any = await simulateMsgs(
          CHAIN_INFO,
          key.bech32Address,
          [sendMsg],
          [
            {
              denom: CONST.currency.toLowerCase(),
              amount: "100000000",
            },
          ],
        );

        if (gasFeeRes?.error) {
          if (
            typeof gasFeeRes?.data === "string" &&
            gasFeeRes?.data.includes("unrecognized/unsupported public key type")
          ) {
            throw new Error(
              "You’ll need to register yourself on the " +
                CONST.chainName +
                " network first.",
            );
          } else {
            throw new Error("Something went wrong!");
          }
        } else {
          const provider = getWalletProvider();
          await sendMsgs(provider, CHAIN_INFO, key.bech32Address, [sendMsg], {
            amount: [
              {
                denom: CONST.currency.toLowerCase(),
                amount: "100000000",
              },
            ],
            gas: Math.floor(Number(gasFeeRes?.gasUsed ?? 0) * 1.5).toString(),
          });
          toast.success("Proposal created successfully");
          navigate("/");
          setPropData({
            title: "",
            description: "",
            deposit: "",
          });
        }
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Something went wrong!");
      console.log("error while creating proposal : ", error);
    } finally {
      setBtnDisabled(false);
    }
  }

  const handleKeplrModal = () => {
    setkeplrModalOpen(!keplrModalOpen);
  };

  async function connectWallet(type: string) {
    let data;
    if (type === "keplr") {
      data = await ensureKeplrConnected();
    } else if (type === "cosmostation") {
      data = await ensureCosmostationConnected();
    } else {
      data = await ensureQubeticsConnected();
    }

    if (data?.connected && data?.address) {
      setIsWallet(true);
      setWalletAddress(data?.address);
      setWalletType(type);
      if (data?.evmAddress) {
        setEvmAddress(data.evmAddress);
      }
      localStorage.setItem("wltConnected", "true");
      localStorage.setItem("wltAddress", data?.address);
      localStorage.setItem("wltType", type);
    }
    handleKeplrModal();
  }

  const data = [
    {
      action: "Min Deposit",
      days: `${
        noExponent(
          votingWidgetsData?.params?.min_deposit[0]?.amount
            ? votingWidgetsData?.params?.min_deposit[0]?.amount / 10 ** 18
            : 0,
        ) ?? "-"
      } ${CONST.currency}`,
    },
    {
      action: "Max Deposit Period",
      days: `${
        convertSeconds(
          votingWidgetsData?.params?.max_deposit_period
            ? votingWidgetsData?.params?.max_deposit_period.split("s")[0]
            : 0,
        ) ?? 0
      }`,
    },
    {
      action: "Voting Period",
      days: `${convertSeconds(
        votingWidgetsData?.voting_params?.voting_period
          ? votingWidgetsData?.voting_params?.voting_period.split("s")[0]
          : 0,
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
            {(!isWallet || !walletAddress) && (
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
                <button
                  disabled={btnDisabled}
                  className="commonBtn"
                  onClick={handleCreateProposal}
                >
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
          <>
            <div
              className="keplerContent"
              onClick={() => connectWallet("keplr")}
            >
              <img src={keplr} alt="keplr" />
              <div style={{ cursor: "pointer" }}>
                <h4>Keplr</h4>
              </div>
            </div>
            <div
              className="keplerContent"
              onClick={() => connectWallet("cosmostation")}
            >
              <img src={cosmostation} alt="cosmostation" />
              <div style={{ cursor: "pointer" }}>
                <h4>Cosmostation</h4>
              </div>
            </div>
            <div
              className="keplerContent"
              onClick={() => connectWallet("qubetics")}
            >
              <img src={logo} alt="qubetics" />
              <div style={{ cursor: "pointer" }}>
                <h4>Qubetics</h4>
              </div>
            </div>
            <p style={{ color: "#fff", fontSize: "large" }}>
              Note: If you use a Wallet, you will have access to all features
            </p>
          </>
        }
      />
    </>
  );
}

export default CreateProposal;
