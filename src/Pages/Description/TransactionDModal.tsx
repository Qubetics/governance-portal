// TransactionDModal.tsx
import React from "react";
import { Select } from "antd";
import {
  CopyIcon,
  InfoIcon,
  Logo,
} from "../../Common/assets/StoreAsset/StoreAsset";
import CustomInput from "../../Common/Input/CustomInput";
import { SelectProps } from "antd/es/select";

const { Option } = Select;

const handleChange = (value: string) => {
  console.log(`selected ${value}`);
};

function TransactionDModal() {
  const data = [
    { network: "Network", value: process.env?.REACT_APP_PROJECT_NAME ?? "" },
    {
      network: "Trx Hash",
      value:<span className="trxValue"><CopyIcon/></span> 
    },
  ];
  return (
    <div className="selectOptionModal">
      <h3>
        <Logo />
        {process.env?.REACT_APP_PROJECT_NAME ?? "" }
      </h3>
      <div className="selectOptionModal_transInfo">
        <div className="selectOptionModal_transInfo_select">
          <h4>Transaction Info</h4>
          <Select
            defaultValue="Success"
            style={{ width: 122 }}
            className="greenSelect"
            onChange={handleChange}
            options={[
              {
                value: "failed",
                label: "failed",
              },
              {
                value: "wait",
                label: "wait",
              },
            ]}
          />
        </div>
        <div className="selectOptionModal_transInfo_network">
          {data.map((item, index) => (
            <div key={index} className="innerItem">
              <p>{item.network}</p>
              <h5>{item.value}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransactionDModal;
