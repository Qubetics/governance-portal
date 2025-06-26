import React from 'react'
import { Searchicon } from "../assets/StoreAsset/StoreAsset";
import "./SearchbarComponent.scss"
function SearchbarComponent() {
  return (
    <div className="container">
    {/* {searchStatus === FetchingStatus ? <Loader /> : */}
      <div className="searchbar">
        <div>
          <input
            placeholder="Search for an address, block, transaction/block hash"
            // value={searchValue}
            // onChange={(e) => handleSearchChange(e)}
            // onKeyUp={(e) => handleEnterClick(e)}
            // onFocus={onFocus}
            // onBlur={onBlur}
          />
         <Searchicon />

          <button>Search</button>
        </div>
      </div>
    {/* } */}
  </div>
  )
}

export default SearchbarComponent