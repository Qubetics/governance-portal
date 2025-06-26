import "./Description.scss";
import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import NoData from "../../Common/assets/no-data.png"
import { httpReqest } from "../../Common/httpRequest";
import { CHAIN_INFO, CONST } from "../../Common/constants";
import { copyToClipBoard, formatString, noExponent } from "../../Common/Utility";
import { Empty, Input, Modal, Progress, Table, Tabs, TabsProps } from "antd";
import { CopyIcon, Searchicon } from "../../Common/assets/StoreAsset/StoreAsset";

function Voter({ propId, tallyData }: { propId: any; tallyData: any }) {
  const [apiData, setApiData] = useState<any[] | []>([]);
  const [noApiData, setNoApiData] = useState<any[] | []>([]);
  const [yesApiData, setYesApiData] = useState<any[] | []>([]);
  const [vetoApiData, setVetoApiData] = useState<any[] | []>([]);
  const [abstainApiData, setAbstainApiData] = useState<any[] | []>([]);

  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [currentPageAll, setCurrentPageAll] = useState(1);
  const [currentPageYes, setCurrentPageYes] = useState(1);
  const [currentPageVeto, setCurrentPageVeto] = useState(1);
  const [currentPageAbstain, setCurrentPageAbstain] = useState(1);

  const [currentTab, setCurrentTab] = useState(1);
  const [yesPercentage, setYesPercentage] = useState(0);
  const [noPercentage, setNoPercentage] = useState(0);
  const [vetoPercentage, setVetoPercentage] = useState(0);
  const [abstainPercentage, setAbstainPercentage] = useState(0);

  const [searchedVal, setSearchedVal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabData, setTabData] = useState<{
    yes: number | string;
    no: number | string;
    abstain: number | string;
    veto: number | string;
    all: number | string;
  }>({
    yes: 0,
    no: 0,
    abstain: 0,
    veto: 0,
    all: 0,
  });

  const columns = [
    {
      title: "Block",
      dataIndex: "blockNumber",
      key: "blockNumber",
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      render: ((data: any) => {
        let className = "";
        switch ((data ?? "").toLowerCase()) {
          case "yes":
            className = "green"
            break;

          case "no":
            className = "red"
            break;

          case "veto":
            className = "pink"
            break;

          default:
            break;
        }
        return <span className={className}>{data}</span>
      })
    },
    {
      title: "Address",
      dataIndex: "voter",
      key: "voter",
      render: ((data: any) => {
        // return formatString(data ?? "", 10, 10)
        return <>
          <span>{formatString(data ?? "", 10, 10)}</span>
          <span className="pointer" onClick={() => (copyToClipBoard(data ?? ''))}> <CopyIcon /></span>
        </>
      })
    },
    {
      title: "Transaction Hash",
      dataIndex: "txHash",
      key: "txHash",
      render: ((data: any) => {
        return <>
          <a href={`${process.env.REACT_APP_EXPLORER_URL}/tx/${data}`} target="blank">{formatString(data ?? "", 10, 10)}</a>
          <span className="pointer" onClick={() => (copyToClipBoard(data ?? ''))}> <CopyIcon /></span>
        </>
      })
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * fetch all voters using api
   */
  const fetchAllVoters = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/voters?page=${currentPageAll}&limit=${CONST.liveProposalLimit}&proposalId=${propId}`;
    const data = await httpReqest(url, "GET", null);
    if (!data?.error) {

      setApiData(data?.data?.data?.voters);
      setTabData({
        yes: data.data?.data?.yesCount ?? 0,
        no: data.data?.data?.noCount ?? 0,
        abstain: data.data?.data?.abstainCount ?? 0,
        veto: data.data?.data?.vetoCount ?? 0,
        all: data.data?.data?.totalCount,
      });

      setYesPercentage(data.data?.data?.yesCount && data.data?.data?.totalCount ? (+ data.data?.data?.yesCount / +data.data?.data?.totalCount) * 100 : 0)
      setNoPercentage(data.data?.data?.noCount && data.data?.data?.totalCount ? (+ data.data?.data?.noCount / +data.data?.data?.totalCount) * 100 : 0)
      setVetoPercentage(data.data?.data?.vetoCount && data.data?.data?.totalCount ? (+ data.data?.data?.vetoCount / +data.data?.data?.totalCount) * 100 : 0)
      setAbstainPercentage(data.data?.data?.abstainCount && data.data?.data?.totalCount ? (+ data.data?.data?.abstainCount / +data.data?.data?.totalCount) * 100 : 0)
    }
  };

  /**
   * fetch yes voters using api
   */
  const fetchYesVoters = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/voters?page=${currentPageYes}&limit=${CONST.liveProposalLimit}&proposalId=${propId}&answer=yes`;
    const data = await httpReqest(url, "GET", null);
    if (!data?.error) {
      setYesApiData(data?.data?.data?.voters);
    }
  };

  /**
   * fetch no voters using api
   */
  const fetchNoVoters = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/voters?page=${currentPageYes}&limit=${CONST.liveProposalLimit}&proposalId=${propId}&answer=no`;
    const data = await httpReqest(url, "GET", null);
    if (!data?.error) {
      setNoApiData(data.data?.data?.voters);
    }
  };

  /**
   * fetch abstain voters using api
   */
  const fetchAbstainVoters = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/voters?page=${currentPageAbstain}&limit=${CONST.liveProposalLimit}&proposalId=${propId}&answer=abstain`;
    const data = await httpReqest(url, "GET", null);
    if (!data?.error) {
      setAbstainApiData(data.data?.data?.voters);
    }
  };

  /**
   * fetch veto voters using api
   */
  const fetchVetoVoters = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/voters?page=${currentPageVeto}&limit=${CONST.liveProposalLimit}&proposalId=${propId}&answer=veto`;
    const data = await httpReqest(url, "GET", null);
    if (!data?.error) {
      setVetoApiData(data.data?.data?.voters);
    }
  };

  useEffect(() => {
    fetchAllVoters();
  }, [currentPageAll]);

  useEffect(() => {
    fetchAbstainVoters();
  }, [currentPageAbstain]);

  useEffect(() => {
    fetchNoVoters();
  }, [currentPageNo]);

  useEffect(() => {
    fetchYesVoters();
  }, [currentPageYes]);

  useEffect(() => {
    fetchVetoVoters();
  }, [currentPageVeto]);

  /**
   * handle pagination for all voter list
   * @param page
   */
  const handlePageChangeAllVoters = (page: number) => {
    setCurrentPageAll(page);
  };

  /**
   * handle pagination for yes voter list
   * @param page
   */
  const handlePageChangeYesVoters = (page: number) => {
    setCurrentPageYes(page);
  };

  /**
   * handle pagination for no voter list
   * @param page
   */
  const handlePageChangeAbstainVoters = (page: number) => {
    setCurrentPageAbstain(page);
  };

  /**
   * handle pagination for abstain voter list
   * @param page
   */
  const handlePageChangeVetoVoters = (page: number) => {
    setCurrentPageVeto(page);
  };

  /**
   * handle pagination for veto voter list
   * @param page
   */
  const handlePageChangeNoVoters = (page: number) => {
    setCurrentPageNo(page);
  };

  /**
   * handle input for search
   * @param e
   */
  const handleSearchChange = (e: any) => {
    setSearchedVal(e.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  /**
   * handle search
   * @returns
   */
  const handleSearch = async () => {
    try {
      if (searchedVal?.length !== 44) {
        toast.error("Please enter correct address for search!");
        return;
      }
      const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/voters/searching?proposalId=${propId}&address=${searchedVal}`;
      const data = await httpReqest(url, "GET", null);
      if (!data?.error) {
        switch (data.data?.data?.voters?.answer) {
          case "yes":
            setCurrentTab(2);
            setYesApiData(data.data?.data?.voters ? [data.data?.data.voters] : []);
            setTabData({
              ...tabData,
              yes: data.data?.data?.voters ? 1 : 0,
            });
            break;

          case "no":
            setCurrentTab(3);
            setNoApiData(data.data?.data?.voters ? [data.data?.data.voters] : []);
            setTabData({
              ...tabData,
              no: data.data?.data?.voters ? 1 : 0,
            });
            break;

          case "abstain":
            setCurrentTab(4);
            setAbstainApiData(data.data?.data?.voters ? [data.data?.data.voters] : []);
            setTabData({
              ...tabData,
              abstain: data.data?.data?.voters ? 1 : 0,
            });
            break;

          case "veto":
            setCurrentTab(5);
            setVetoApiData(data.data?.data?.voters ? [data.data?.data.voters] : []);
            setTabData({
              ...tabData,
              veto: data.data?.data?.voters ? 1 : 0,
            });
            break;

          default:
            setCurrentTab(1);
            setApiData(data.data?.data?.voters ? [data.data?.data.voters] : []);
            setTabData({
              ...tabData,
              all: data.data?.data?.voters ? 1 : 0,
            });
            break;
        }
      } else {
        toast.error("No voter found with this address!");
      }
    } catch (error) {
      console.log("Error while search voters: ", error);
    }
  };

  const operations = (
    <div className="searchbar">
      <Input
        value={searchedVal}
        allowClear
        className="srchInput"
        placeholder="Search by voter"
        onChange={handleSearchChange}
        prefix={
          <span onClick={handleSearch}>
            <Searchicon />
          </span>
        }
      />
    </div>
  );
  const CustomEmpty = () => (
    <Empty
      image={<img src={NoData} alt="nodata"/>} 
      imageStyle={{
        height: 60,
      }}
      description={
        <span style={{color:"#fff"}}>
         Not Found
        </span>
      }
    />
  );
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All",
      children: allVoters(),
    },
    {
      key: "2",
      label: "Yes",
      children: yesVoters(),
    },
    {
      key: "3",
      label: "No",
      children: noVoters(),
    },
    {
      key: "4",
      label: "Abstain",
      children: abstainVoters(),
    },
    {
      key: "5",
      label: "Veto",
      children: vetoVoters(),
    },
  ];

  /**
   * create table element for all voters listing
   * @returns jsx element
   */
  function allVoters() {
    return (
      <div>
        {" "}
        <div className="cmnTable">
          <Table
            dataSource={apiData}
            columns={columns}
            locale={{ emptyText: <CustomEmpty /> }} 
            pagination={
              Number(tabData?.all) > CONST.liveProposalLimit && {
                current: currentPageAll,
                pageSize: CONST.liveProposalLimit,
                total: Number(tabData.all),
                onChange: handlePageChangeAllVoters,
              }
            }
          />
        </div>
      </div>
    );
  }

  /**
   * create table element for yes voters listing
   * @returns jsx element
   */
  function yesVoters() {
    return (
      <div>
        {" "}
        <div className="cmnTable">
          <Table
            dataSource={yesApiData}
            columns={columns}
            locale={{ emptyText: <CustomEmpty /> }} 
            pagination={
              Number(tabData?.yes) > CONST.liveProposalLimit && {
                current: currentPageYes,
                pageSize: CONST.liveProposalLimit,
                total: Number(tabData.yes),
                onChange: handlePageChangeYesVoters,
              }
            }
          />
        </div>
      </div>
    );
  }

  /**
   * create table element for no voters listing
   * @returns jsx element
   */
  function noVoters() {
    return (
      <div>
        {" "}
        <div className="cmnTable">
          <Table
            dataSource={noApiData}
            columns={columns}
            locale={{ emptyText: <CustomEmpty /> }} 
            pagination={
              Number(tabData?.no) > CONST.liveProposalLimit && {
                current: currentPageNo,
                pageSize: CONST.liveProposalLimit,
                total: Number(tabData.no),
                onChange: handlePageChangeNoVoters,
              }
            }
          />
        </div>
      </div>
    );
  }

  /**
   * create table element for abstain voters listing
   * @returns jsx element
   */
  function abstainVoters() {
    return (
      <div>
        {" "}
        <div className="cmnTable">
          <Table
            dataSource={abstainApiData}
            columns={columns}
            locale={{ emptyText: <CustomEmpty /> }} 
            pagination={
              Number(tabData?.abstain) > CONST.liveProposalLimit && {
                current: currentPageNo,
                pageSize: CONST.liveProposalLimit,
                total: Number(tabData.abstain),
                onChange: handlePageChangeAbstainVoters,
              }
            }
          />
        </div>
      </div>
    );
  }

  /**
   * create table element for veto voters listing
   * @returns jsx element
   */
  function vetoVoters() {
    return (
      <div>
        {" "}
        <div className="cmnTable">
          <Table
            dataSource={vetoApiData}
            columns={columns}
            locale={{ emptyText: <CustomEmpty /> }} 
            pagination={
              Number(tabData?.veto) > CONST.liveProposalLimit && {
                current: currentPageNo,
                pageSize: CONST.liveProposalLimit,
                total: Number(tabData.veto),
                onChange: handlePageChangeVetoVoters,
              }
            }
          />
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: any) => {
    setCurrentTab(tab);
    setSearchedVal("");
  };

  return (
    <div className="descriptionSummary voterSec" onKeyDown={handleKeyDown}>
      <div className="summaryDetail">
        <h2 className="summaryHeading">Summary</h2>
        <div className="summaryInner">
          <div className="votedAccounts">
            <h3>Voted Accounts</h3>
            <p>{tabData.all ?? ""}</p>
          </div>
          <div className="voteRangeSec">
            <div className="topDetail">
              <h3>
                YES&nbsp;<span>{yesPercentage}%</span>
              </h3>
              <h4>{tabData.yes}</h4>
            </div>
            <div className="progressRange">
              <Progress percent={yesPercentage} showInfo={false} className="green" />
              <p>{tallyData?.yes_count ? noExponent(Number(tallyData?.yes_count) / 10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)) : "-"}</p>
            </div>
            <div className="topDetail">
              <h3>
                No&nbsp;<span>{noPercentage}%</span>
              </h3>
              <h4>{tabData.no}</h4>
            </div>
            <div className="progressRange">
              <Progress percent={noPercentage} showInfo={false} className="red" />
              <p>{tallyData?.no_count ? noExponent(Number(tallyData?.no_count) / 10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)) : "-"}</p>
            </div>
            <div className="topDetail">
              <h3>
                Veto&nbsp;<span>{vetoPercentage}%</span>
              </h3>
              <h4>{tabData.veto}</h4>
            </div>
            <div className="progressRange">
              <Progress percent={vetoPercentage} showInfo={false} className="pink" />
              <p>{tallyData?.no_with_veto_count ? noExponent(Number(tallyData?.no_with_veto_count) / 10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)) : "-"}</p>
            </div>
            <div className="topDetail">
              <h3>
                Abstain&nbsp;<span>{abstainPercentage}%</span>
              </h3>
              <h4>{tabData?.abstain}</h4>
            </div>
            <div className="progressRange">
              <Progress percent={abstainPercentage} showInfo={false} className="gray" />
              <p>{tallyData?.abstain_count ? noExponent(Number(tallyData?.abstain_count) / 10 ** Number(CHAIN_INFO?.stakeCurrency?.coinDecimals ?? 18)) : "-"}</p>
            </div>
          </div>
          <div className="voterBtn">
            <button className="cmnBtn" onClick={showModal}>
              Show Recent Voters
            </button>
          </div>
        </div>
        <Modal
          title="Recent Voters"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          className="cmnModal voterModal"
          footer={null}
        >
          <div className="tabSec">
            <Tabs
              onChange={handleTabChange}
              defaultActiveKey="1"
              activeKey={`${currentTab}`}
              items={items}
              className="cmnTab"
              tabBarExtraContent={operations}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Voter;
