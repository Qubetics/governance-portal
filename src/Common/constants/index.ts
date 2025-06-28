import { ChainInfo } from "@keplr-wallet/types";

export const CONST = {
  tableDefaultLimit: 10,
  liveProposalLimit: 5,
  chainName: process.env.REACT_APP_CHAIN_NAME ?? "",
  currency: process.env.REACT_APP_COIN_DENOM ?? "",
};

export const FOOTER_LINK: {
  validator: string;
  explorer: string;
  delegator: string;
  qubeQode: string;
  privacyPolicy: string;
  terms: string;
  ide: string;
  officialWebsite: string;
  networkDoc: string;
  documentation: string;
  twitter: string;
  facebook: string;
  telegram: string;
  instagram: string;
  github: string;
} = JSON.parse(process.env.REACT_APP_FOOTER_LINKS ?? "{}");

export const CHAIN_INFO: ChainInfo = {
  // Chain-id of the Osmosis chain.
  chainId: process.env.REACT_APP_CHAIN_ID ?? "",
  // The name of the chain to be displayed to the user.
  chainName: process.env.REACT_APP_CHAIN_RPC ?? "",
  // RPC endpoint of the chain. In this case we are using blockapsis, as it's accepts connections from any host currently. No Cors limitations.
  rpc: process.env.REACT_APP_CHAIN_RPC ?? "",
  // REST endpoint of the chain.
  rest: process.env.REACT_APP_CHAIN_REST ?? "",
  // Staking coin information
  stakeCurrency: {
    // Coin denomination to be displayed to the user.
    coinDenom: process.env.REACT_APP_COIN_DENOM ?? "",
    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
    coinMinimalDenom: process.env.REACT_APP_COIN_MINIMAL_DENOM ?? "",
    // # of decimal points to convert minimal denomination to user-facing denomination.
    coinDecimals: Number(process.env.REACT_APP_COIN_DECIMALS ?? 18),
    coinGeckoId: process.env.REACT_APP_COIN_GECKO_ID,
    coinImageUrl: process.env.REACT_APP_COIN_IMAGE_URL,
  },
  // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
  // The 'stake' button in Keplr extension will link to the webpage.
  // walletUrlForStaking: "",
  // The BIP44 path.
  bip44: {
    // You can only set the coin type of BIP44.
    // 'Purpose' is fixed to 44.
    coinType: Number(process.env.REACT_APP_BIP44_COIN_TYPE ?? 0),
  },
  // Bech32 configuration to show the address to user.
  // This field is the interface of
  // {
  //   bech32PrefixAccAddr: string;
  //   bech32PrefixAccPub: string;
  //   bech32PrefixValAddr: string;
  //   bech32PrefixValPub: string;
  //   bech32PrefixConsAddr: string;
  //   bech32PrefixConsPub: string;
  // }
  bech32Config: {
    bech32PrefixAccPub: process.env.REACT_APP_BECH32_PREFIX_PUB ?? "",
    bech32PrefixAccAddr: process.env.REACT_APP_BECH32_PREFIX_ADDR ?? "",
    bech32PrefixValPub: process.env.REACT_APP_BECH32_PREFIX_VAL_PUB ?? "",
    bech32PrefixConsPub: process.env.REACT_APP_BECH32_PREFIX_CONS_PUB ?? "",
    bech32PrefixValAddr: process.env.REACT_APP_BECH32_PREFIX_VAL_ADDR ?? "",
    bech32PrefixConsAddr: process.env.REACT_APP_BECH32_PREFIX_CONS_ADDR ?? "",
  },
  // List of all coin/tokens used in this chain.
  currencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: process.env.REACT_APP_COIN_DENOM ?? "",
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: process.env.REACT_APP_COIN_MINIMAL_DENOM ?? "",
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: Number(process.env.REACT_APP_COIN_DECIMALS ?? 0),
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
    },
  ],
  // List of coin/tokens used as a fee token in this chain.
  feeCurrencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: process.env.REACT_APP_COIN_DENOM ?? "",
      // Actual denom (i.e. uosmo, uscrt) used by the blockchain.
      coinMinimalDenom: process.env.REACT_APP_COIN_MINIMAL_DENOM ?? "",
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: Number(process.env.REACT_APP_COIN_DECIMALS ?? 0),
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
      // (Optional) This is used to set the fee of the transaction.
      // If this field is not provided and suggesting chain is not natively integrated, Keplr extension will set the Keplr default gas price (low: 0.01, average: 0.025, high: 0.04).
      // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
      // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
      gasPriceStep: {
        low: Number(process.env.REACT_APP_GAS_PRICE_LOW ?? 0),
        average: Number(process.env.REACT_APP_GAS_PRICE_AVERAGE ?? 0),
        high: Number(process.env.REACT_APP_GAS_PRICE_HIGH ?? 0),
      },
    },
  ],
};
