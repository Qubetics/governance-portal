import { Collapse } from "antd";
import type { CollapseProps } from "antd";
// import { Translation } from "../../Common/assets/StoreAsset/StoreAsset";

function DescriptionSummary(props: any) {
  const { data } = props;

  const onChange = (key: string | string[]) => {
    // console.log(key);
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Raw Meta",
      children: <p>{data?.metaData}</p>,
    },
  ];
  return (
    <div className="descriptionSummary">
      {/* <div className="chatSummary">
        <h2>Chat GPT Summary</h2>
        <button>
          {" "}
          <Translation />
          Translation feature temporarily suspended.
        </button>
      </div>
      <div className="proposalsSummary">
        <ul className="listing">
          <li>
            Allocate 52,845 OSMO over 6 weeks to match 97,74 FXS and 9,068,080
            PICA emissions for 3 new pools enabled by Picasso’s Ethereum IBC
            bridge.
          </li>
          <li>
            Justification for the spend includes the potential to attract
            liquidity and users from Ethereum, enhancing Osmosis' position
            within the DeFi industry.
          </li>
          <li>
            The deployment mechanism involves transferring 52,845 OSMO to the
            Builder Multisig, using 150 OSMO for gauge creation (which returns
            to the community pool), and automatically distributing the remaining
            52,695 OSMO to the mentioned pools over 6 weeks.
          </li>
        </ul>
      </div> */}
      <div className="summaryDetail">
        <h2 className="summaryHeading">Summary</h2>
        <div className="summaryInner">
          <div className="topDetail">
            {data?.summary
              ?.replace(/\\n/g, "\n") // Replace all `\\n` with actual newlines
              .split(/\n{2,}/) // Split into paragraphs where two or more `\n` exist
              .filter((line: any) => line.trim() !== "") // Remove empty paragraphs
              .map((paragraph: string, index: number) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  {paragraph
                    .split("\n") // Split individual lines within a paragraph
                    .map((line, lineIndex) => {
                      const trimmedLine = line.trim();
                      const isHeading = /^[A-Za-z\s]+:$/.test(trimmedLine); // Detect headings ending with ":"
                      const isBullet = /^[-\d.]\s/.test(trimmedLine); // Detect bullets (- or numbers with a dot)

                      return (
                        <p
                          key={`${index}-${lineIndex}`}
                          style={{
                            marginTop: isHeading
                              ? "20px"
                              : isBullet
                              ? "10px"
                              : "5px",
                            fontWeight: isHeading ? "bold" : "normal",
                            paddingLeft: isBullet ? "20px" : "0", // Indent bullets
                          }}
                        >
                          {trimmedLine}
                        </p>
                      );
                    })}
                </div>
              ))}
          </div>

          {/* <div className="proposalsSummary">
            <ul className="listing">
              <li>sFRAX / USDC (yield bearing)</li>
              <li>sfrxETH / OSMO (yield bearing)</li>
              <li>FXS / OSMO (cross-pollinate for alignment)</li>
            </ul>
          </div> */}
          {/* <div className="justificationSec">
            <div className="innerDeatl">
              <h3>Justification for Spend</h3>
              <p>
                $65k worth of OSMO (52,845 ) to match the $65K worth of FXS
                (97,74) and $65k of PICA (9,068,080) at the time of posting.
              </p>
            </div>
            <div className="innerDeatl">
              <p>
                The new IBC connection offers a key infrastructure to enable a
                truly cross-ecosystem DeFi industry. The spend incentivizes both
                liquidity and users from Ethereum - specifically Frax to port
                over to Cosmos.
              </p>
            </div>
            <div className="innerDeatl">
              <p>
                This synergy benefits both ecosystems and positions Osmosis as a
                pivotal hub for Ethereum’s blue-chip DeFi assets and
                yield-bearing products, enhancing its appeal and functionality
                within the broader DeFi industry.
              </p>
            </div>
            <div className="innerDeatl">
              <h3>Deployment Mechanism</h3>
              <p>
                This proposal requests 52,845 OSMO to be transferred to the
                Builder Multisig.
              </p>
            </div>
            <div className="innerDeatl">
              <p>
                150 OSMO will then be used for gauge creation, which returns to
                the Osmosis community pool.
              </p>
            </div>
            <div className="innerDeatl">
              <p>
                The remaining 52,695 OSMO will be automatically distributed to
                the mentioned pools over a 6 week period.
              </p>
            </div>
          </div> */}
        </div>
        {data?.metaData ? (
          <>
            <h2 className="summaryHeading">Meta</h2>
            <div className="summaryInner">
              <Collapse
                items={items}
                defaultActiveKey={["1"]}
                onChange={onChange}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default DescriptionSummary;
