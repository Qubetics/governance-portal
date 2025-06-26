export type AccountResponse = {
  account: BaseAccount
}
export type BaseAccount = {
  base_account: Account
}

export type Account = {
  account_number: string;
  address: string;
  sequence: string;
  pub_key: {
    "@type": string;
    key: string
  }
};
