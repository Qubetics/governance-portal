import "./Home.scss";
import Loader from "../../Common/Loader";
import ProposalsCard from "./ProposalsCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import NoData from "../../Common/assets/no-data.png";
import { CONST } from "../../Common/constants/index";
import Path from "../../Routing/Constant/RoutePaths";
import { httpReqest } from "../../Common/httpRequest";
import { Empty, Input, Pagination, Progress, Select, Table } from "antd";
import {
  ThreeLine,
  Searchicon,
  CloseIcon,
} from "../../Common/assets/StoreAsset/StoreAsset";
import {
  calculateElapsedTimePercentage,
  formatDate,
} from "../../Common/Utility";

function Home() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const debounceTimeoutRef = useRef<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredVal, setFilteredVal] = useState("all");
  const [allProposals, setAllProposals] = useState([]);
  const [proposalCount, setProposalCount] = useState(0);
  const [liveProposals, setLiveProposals] = useState([]);
  const [isDivVisible, setIsDivVisible] = useState(false);
  const [liveProposalCount, setLiveProposalCount] = useState(0);
  const [currentPageLiveProp, setCurrentPageLiveProp] = useState(1);
  const [widgetsData, setWidgetsData] = useState<
    {
      cardName: string;
      value: number | string;
    }[]
  >([]);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    try {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
      fetchLiveProposals();
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  }, []);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDivVisible(false);
    }
  };

  useEffect(() => {
    if (isDivVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDivVisible]);

  const handleButtonClick = () => {
    setIsDivVisible(!isDivVisible);
  };

  const handleChange = (value: string) => {
    setFilteredVal(value);
    handleButtonClick();
  };

  const fetchAllProposals = async () => {
    setLoader(true);
    const url1 = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals?page=${currentPage}&limit=${CONST.tableDefaultLimit}`;
    const res = await httpReqest(url1, "GET", null);
    if (!res?.error) {
      setAllProposals(res.data.data?.proposals || []);
      setProposalCount(res.data.data?.totalCount || 0);

      if (!widgetsData?.length) {
        setWidgetsData([
          ...widgetsData,
          {
            cardName: "Total",
            value: res.data.data?.totalCount || 0,
          },
          {
            cardName: "Voting Period",
            value: res.data.data?.votingCount || 0,
          },
          {
            cardName: "Passed",
            value: res.data.data?.passedCount || 0,
          },
          {
            cardName: "Rejected",
            value: res.data.data?.rejectCount || 0,
          },
        ]);
      }
    }
    setLoader(false);
  };

  const fetchLiveProposals = async () => {
    const url1 = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals?page=${currentPageLiveProp}&limit=${CONST.liveProposalLimit}&status=voting`;
    const res = await httpReqest(url1, "GET", null);
    if (!res?.error) {
      setLiveProposalCount(res.data.data?.votingCount || 0);
      setLiveProposals(res.data.data?.proposals || []);
    }
  };

  useEffect(() => {
    fetchAllProposals();
  }, [currentPage]);

  useEffect(() => {
    fetchLiveProposals();
  }, [currentPageLiveProp]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filteredVal]);

  const handlePageChangeAllProposal = (page: any) => {
    setCurrentPage(page);
  };

  const handlePageChangeLiveProposal = (page: any) => {
    setCurrentPageLiveProp(page);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "proposalId",
      key: "proposalId",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (data: any) => {
        return <span className="scndChild">{data}</span>;
      },
    },
    {
      title: "Type",
      dataIndex: "proposerType",
      key: "proposerType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => {
        let color;
        switch (status) {
          case "pending":
            color = "orange";
            break;
          case "passed":
            color = "green";
            break;
          case "failed":
          case "rejected":
            color = "red";
            break;
          default:
            color = "blue";
        }
        return <span style={{ color: color }}>{status[0].toUpperCase() + status.slice(1)}</span>;
      },
    },
    {
      title: "Voting End on",
      dataIndex: "votingEndTime",
      key: "voting-ending-on",
      render: (text: string) => formatDate(text),
    },
  ];

  async function handleSearch() {
    try {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (searchTerm && filteredVal !== "all") {
        debounceTimeoutRef.current = setTimeout(async () => {
          const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/searching?page=${currentPageLiveProp}&limit=${CONST.tableDefaultLimit}&value=${searchTerm}&status=${filteredVal}`;

          const res = await httpReqest(url, "GET", null);
          if (!res?.error) {
            setAllProposals(res?.data.data?.proposals || []);
            setProposalCount(res?.data.data?.totalCount || 0);
          } else if (res?.status === 404) {
            setAllProposals([]);
            setAllProposals(res.data?.proposals || []);
            setProposalCount(0);
          }
        }, 1000);
      } else if (searchTerm && filteredVal === "all") {
        debounceTimeoutRef.current = setTimeout(async () => {
          const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals/searching?page=${currentPageLiveProp}&limit=${CONST.tableDefaultLimit}&value=${searchTerm}`;

          const res = await httpReqest(url, "GET", null);
          if (!res?.error) {
            setAllProposals(res?.data.data?.proposals || []);
            setProposalCount(res?.data.data?.totalCount || 0);
          } else if (res?.status === 404) {
            setAllProposals([]);
            setAllProposals(res.data?.proposals || []);
            setProposalCount(0);
          }
        }, 1000);
      } else if (!searchTerm && filteredVal !== "all") {
        debounceTimeoutRef.current = setTimeout(async () => {
          const url = `${process.env.REACT_APP_BACKEND_URL}/${CONST.chainName.toLowerCase()}/proposals?page=${currentPageLiveProp}&limit=${CONST.tableDefaultLimit}&status=${filteredVal}`;
          const res = await httpReqest(url, "GET", null);
          if (!res?.error) {
            setAllProposals(res?.data.data?.proposals || []);
            setProposalCount(res?.data.data?.totalCount || 0);
          } else if (res?.status === 404) {
            setAllProposals([]);
            setAllProposals(res.data?.proposals || []);
            setProposalCount(0);
          }
        }, 1000);
      } else {
        fetchAllProposals();
      }
    } catch (error) {
      console.log("error while search : ", error);
    }
  }

  async function handleSearchInput(e: any) {
    const value = e.target.value;
    setSearchTerm(value);
  }
  const CustomEmpty = () => (
    <Empty
      image={<img src={NoData} alt="nodata" />}
      imageStyle={{
        height: 60,
      }}
      description={<span style={{ color: "#fff" }}>No Proposals Yet</span>}
    />
  );
  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="homeSec">
          <div className="container">
            <div className="createProposalBtn">
              <button
                className="cmnBtn"
                onClick={() => navigate(Path.CREATEPROPOSAL)}
              >
                Create Proposal
              </button>
            </div>
            <div className="proposalsSummary">
              <h2 className="cardHeading">Proposals Summary</h2>
              <ProposalsCard data={widgetsData} />
            </div>
            <div className="liveProposals proposalsSummary">
              <h2 className="cardHeading">
                Live Proposals{" "}
                <span>
                  {liveProposalCount}/{liveProposalCount}
                </span>
                {/* <Progress percent={liveProposalCount} /> */}
              </h2>
              {liveProposalCount
                ? liveProposals.map((e: any, i) => (
                  <div
                    className="votingPeriod"
                    key={i + "liveproposal"}
                    onClick={() => {
                      navigate("description" + "/" + e?.proposalId);
                    }}
                  >
                    <h2 className="votingHeading">Voting Period</h2>
                    <div className="progressPeriod">
                      <h2 className="progressName">
                        #{e?.proposalId ?? ""}. {e?.title}
                      </h2>
                      <div className="rightDeatil">
                        <h3>{e?.proposerType}</h3>
                        <p>Voting End on</p>
                        <span>{formatDate(e?.votingEndTime)}</span>
                      </div>
                    </div>
                    <Progress
                      percent={
                        calculateElapsedTimePercentage(
                          e?.votingStartTime,
                          e?.votingEndTime
                        ) ?? 0
                      }
                      showInfo={false}
                    />
                  </div>
                ))
                : ""}

              <Pagination
                defaultCurrent={currentPageLiveProp}
                total={liveProposalCount}
                pageSize={CONST.liveProposalLimit}
                onChange={handlePageChangeLiveProposal}
                hideOnSinglePage={true}
                className="votingPagination"
              />
            </div>

            <div className="allProposal">
              <div className="topDetail">
                <h2>
                  All Proposals{" "}
                  <span>
                    {proposalCount}/{proposalCount}
                  </span>
                </h2>
                <div className="searchSec">
                  <button className="threeLine" onClick={handleButtonClick}>
                    <ThreeLine />
                  </button>
                  {isDivVisible && (
                    <div
                      className="hiddenDiv"
                    // ref={dropdownRef}
                    >
                      <div className="topHeading">
                        <h3>Filter</h3>
                        <span onClick={handleButtonClick}>
                          <CloseIcon />
                        </span>
                      </div>
                      <Select
                        defaultValue="all"
                        value={filteredVal}
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                          { value: "all", label: "All" },
                          { value: "rejected", label: "Rejected" },
                          { value: "voting", label: "Voting" },
                          { value: "passed", label: "Passed" },
                          { value: "deposit", label: "Deposit" },
                          { value: "failed", label: "Failed" },
                        ]}
                      />
                    </div>
                  )}
                  <Input
                    className="srchInput"
                    placeholder="Search"
                    onInput={handleSearchInput}
                    prefix={<Searchicon />}
                  />
                </div>
              </div>
              <div className="cmnTable proposalTable">
                <Table
                  dataSource={allProposals}
                  columns={columns}
                  locale={{ emptyText: <CustomEmpty /> }}
                  pagination={
                    proposalCount > CONST.tableDefaultLimit && {
                      current: currentPage,
                      pageSize: CONST.tableDefaultLimit,
                      total: proposalCount,
                      onChange: handlePageChangeAllProposal,
                    }
                  }
                  onRow={(record: any, rowIndex) => {
                    return {
                      onClick: () => {
                        navigate("description" + "/" + record?.proposalId);
                      },
                    };
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
