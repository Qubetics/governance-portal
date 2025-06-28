import "../../index.scss";
import Voter from "./Voter";
import "./Description.scss";
import Details from "./Details";
import toast from "react-hot-toast";
import { Progress, Tabs } from "antd";
import type { TabsProps } from "antd";
import SelectModal from "./SelectModal";
import { useParams } from "react-router";
import { Dec } from "@keplr-wallet/unit";
import DescriptionCard from "./DescriptionCard";
import { UserContext } from "../../Context/store";
import keplr from "../../Common/assets/keplr.svg";
import TransactionDModal from "./TransactionDModal";
import DescriptionSummary from "./DescriptionSummary";
import { httpReqest } from "../../Common/httpRequest";
import { useContext, useEffect, useState } from "react";
import { CHAIN_INFO, CONST } from "../../Common/constants";
import BackButton from "../../Common/BackButton/BackButton";
import CommonModal from "../../Common/commonModal/CommonModal";
import { Vooting } from "../../Common/assets/StoreAsset/StoreAsset";
import {
  formatDate,
  noExponent,
  flooreDecimals,
  calculateTimeRemaining,
  calculateElapsedTimePercentage,
  ensureKeplrConnected,
} from "../../Common/Utility";

function Description() {
  const { id } = useParams();
  const [turnout, setTurnOut] = useState(0);
  // const [voteDone, SetVoted] = useState(0);
  const [propData, setData] = useState<any>(null);
  const [tallyData, setTallyData] = useState<any>([]);
  const [voterData, setVoterData] = useState<any>({});
  const [votingModal, setVotingModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [keplrModalOpen, setkeplrModalOpen] = useState(false);
  const {
    setIsWallet,
    isWallet,
    setWalletAddress,
    walletAddress,
    votingWidgetsData,
  } = useContext(UserContext);
  const [progressPercentage, setProgressPercentage] = useState<any>(0);

  const handleKeplrModal = () => {
    setkeplrModalOpen(!keplrModalOpen);
  };

  const handleVotingModal = () => {
    setVotingModal(!votingModal);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  function findKeyOfLargestValue(obj: {
    yes: number | string;
    no: number | string;
    veto: number | string;
    abstain: number | string;
  }) {
    if (
      +obj.yes === 0 &&
      +obj.no === 0 &&
      +obj.abstain === 0 &&
      +obj.veto === 0
    ) {
      return null;
    }
    let maxKey = null;
    let maxValue = -Infinity;

    for (const [key, value] of Object.entries(obj)) {
      if (+value > maxValue) {
        maxValue = +value;
        maxKey = key;
      }
    }

    return maxKey;
  }

  const fetchProposal = async () => {
    try {
      let totalTally = 0;
      let bondedT = 0;
      const bondedRes = await httpReqest(
        CHAIN_INFO.rest + "/cosmos/staking/v1beta1/pool",
        "GET",
        null
      );

      bondedT = Number(bondedRes?.data?.pool?.bonded_tokens ?? 0);

      const res = await httpReqest(
        process.env.REACT_APP_BACKEND_URL + "/" + CONST.chainName.toLowerCase() + "/proposals/id/" + id,
        "GET",
        null
      );

      if (!res?.error) {
        setData(res?.data?.data?.proposal);
        const tally = JSON.parse(res?.data?.data?.proposal?.tally);

        const tallyKey = {
          yes: tally?.yes_count
            ? noExponent(
              Number(tally?.yes_count) /
              10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)
            )
            : 0,
          no: tally?.no_count
            ? noExponent(
              Number(tally?.no_count) /
              10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)
            )
            : 0,
          veto: tally?.no_with_veto_count
            ? noExponent(
              Number(tally?.no_with_veto_count) /
              10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)
            )
            : 0,
          abstain: tally?.abstain_count
            ? noExponent(
              Number(tally?.abstain_count) /
              10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)
            )
            : 0,
        };

        const key = findKeyOfLargestValue(tallyKey);

        const percentageElapsed = calculateElapsedTimePercentage(
          res.data?.data?.proposal?.votingStartTime,
          res.data?.data?.proposal?.votingEndTime
        );

        totalTally =
          Number(tally?.abstain_count) +
          Number(tally?.no_count) +
          Number(tally?.no_with_veto_count) +
          Number(tally?.yes_count);
        const turnOutVal =
          totalTally && bondedT ? (totalTally / bondedT) * 100 : 0;

        setTurnOut(turnOutVal <= 0 ? 0 : turnOutVal);
        setVoterData(tally);
        setProgressPercentage(percentageElapsed);

        if (!tallyData?.length) {
          setTallyData([
            ...tallyData,
            {
              action: "YES",
              // percentage: tallyKey?.yes && totalTally ? (noExponent(+tallyKey?.yes / totalTally * 100 )?? 0 ): "",
              percentage: "",
              balance: tallyKey?.yes,
              className: "green",
              border: key === "yes",
            },
            {
              action: "NO",
              // percentage:  tallyKey?.no && totalTally ? (noExponent(+tallyKey?.no / totalTally * 100 )?? 0 ): "",
              percentage: "",
              balance: tallyKey?.no,
              className: "red",
              border: key === "no",
            },
            {
              action: "VETO",
              // percentage:  tallyKey?.veto && totalTally ? (noExponent(+tallyKey?.veto / totalTally * 100 )?? 0 ): "",
              percentage: "",
              balance: tallyKey?.veto,
              className: "pink",
              border: key === "veto",
            },
            {
              action: "Abstain",
              // percentage:  tallyKey?.abstain && totalTally ? (noExponent(+tallyKey?.abstain / totalTally * 100 )?? 0 ): "",
              percentage: "",
              balance: tallyKey?.abstain,
              className: "",
              border: key === "abstain",
            },
          ]);
        }
      }
    } catch (error) {
      console.log("erorr while fething or setting up api data ", error);
    }
  }

  useEffect(() => {
    fetchProposal();
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Description",
      children: <DescriptionSummary data={propData} />,
    },
    {
      key: "2",
      label: "Votes",
      children: <Voter propId={id} tallyData={voterData} />,
    },
    {
      key: "3",
      label: "Details",
      children: <Details data={propData} />,
    },
  ];

  async function connectWallet() {
    const data = await ensureKeplrConnected();

    if (data?.address) {
      setIsWallet(true);
      setWalletAddress(data?.address);
      localStorage.setItem("wltConnected", "true");
      localStorage.setItem("wltAddress", data?.address);
    }
    handleKeplrModal();
  }

  return (
    <>
      <div className="descriptionSec">
        <div className="container">
          <BackButton />
          <div className="proposalsSummary">
            <h2 className="cardHeading">
              #{id}. {propData?.title}
            </h2>
            <div className="votingProgress">
              <div className="wallet">
                {propData?.status === "rejected" ? (
                  <h2 className="red">Rejected</h2>
                ) : propData?.status === "voting" ? (
                  <h2>
                    <Vooting />
                    Voting in progress
                  </h2>
                ) :
                  propData?.status === "voting" ?
                    (
                      <h2 className="green">Passed</h2>
                    )
                    : ""
                }
                {propData?.status === "voting" ? (
                  walletAddress && isWallet ? (
                    <button
                      className="commonBtn"
                      onClick={handleVotingModal}
                    >
                      Vote
                    </button>
                  ) : (
                    <button
                      className="commonBtn"
                      onClick={handleKeplrModal}
                    >
                      Connect Wallet
                    </button>
                  )
                ) : (
                  ""
                )}
              </div>
              <div className="quorumSec">
                <h3>Turnout / Quorum</h3>
                <h2>
                  {turnout ? flooreDecimals(turnout, 5) : 0}% /{" "}
                  {votingWidgetsData?.params?.quorum
                    ? noExponent(+votingWidgetsData?.params?.quorum * 100)
                    : 0}
                  %
                </h2>
              </div>
              {
                !(turnout >= 50) &&
                <div className="threeHold">
                  <ul>
                    <li>Threshold not reached ( {turnout ? flooreDecimals(turnout, 5) : 0}% / 50.0% )</li>
                  </ul>
                </div>
              }
              <DescriptionCard data={tallyData} />
              {
                propData?.status === "voting" ?
                  <div className="progressDescription">
                    <div className="topHeading">
                      <h3>Progress</h3>
                      <p>
                        {calculateTimeRemaining(
                          new Date(),
                          propData?.votingEndTime
                        )}{" "}
                        remaining
                      </p>
                    </div>
                    <Progress percent={progressPercentage} showInfo={false} />
                    <div className="topHeading bottumSec">
                      <h3>{formatDate(propData?.votingStartTime)}</h3>
                      <h3>{formatDate(propData?.votingEndTime)}</h3>
                    </div>
                  </div>
                  : ""
              }
            </div>

            <div className="tabSec">
              <Tabs defaultActiveKey="1" items={items} className="cmnTab" />
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
          <div className="keplerContent" onClick={connectWallet}>
            <img src={keplr} alt="keplr" />
            <div style={{ cursor: "pointer" }}>
              <h4>keplr</h4>
            </div>
          </div>
              <p style={{color: "#fff"}}>
               Note: If you use keplr Wallet, you will have access to all features
              </p>
              </>
        }
      />
      <CommonModal
        visible={votingModal}
        onClose={handleVotingModal}
        title="Select Option"
        content={<SelectModal data={propData} close={handleVotingModal} />}
      />
      <CommonModal
        visible={modalVisible}
        onClose={handleCloseModal}
        title="Transaction Detail"
        content={
          <div>
            <TransactionDModal />
          </div>
        }
      />
    </>
  );
}

export default Description;
