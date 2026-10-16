import { TendermintTxTracer } from "@keplr-wallet/cosmos";
import { BroadcastMode, ChainInfo, StdFee } from "@keplr-wallet/types";
import { Buffer } from "buffer";
import Long from "long";
import { PubKey } from "../../proto-types-gen/src/cosmos/crypto/secp256k1/keys";
import { SignMode } from "../../proto-types-gen/src/cosmos/tx/signing/v1beta1/signing";
import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from "../../proto-types-gen/src/cosmos/tx/v1beta1/tx";
import { Any } from "../../proto-types-gen/src/google/protobuf/any";
import { httpReqest } from "../httpRequest";
import { getWalletProvider } from "./index";

export const sendMsgs = async (
  wallet: any,
  chainInfo: ChainInfo,
  sender: string,
  proto: Any[],
  fee: StdFee,
  memo: string = "",
) => {
  const account = await fetchAccountInfo(chainInfo, sender);
  const provider = wallet || getWalletProvider();
  const { pubKey } = await provider.getKey(chainInfo.chainId);

  if (account) {
    const signDoc = {
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: proto,
          memo,
        }),
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: "/ethermint.crypto.v1.ethsecp256k1.PubKey",
              value: PubKey.encode({
                key: pubKey,
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
              multi: undefined,
            },
            sequence: account.sequence,
          },
        ],
        fee: Fee.fromPartial({
          amount: fee.amount.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
          gasLimit: fee.gas,
        }),
      }).finish(),
      chainId: chainInfo.chainId,
      accountNumber: Long.fromString(account.account_number),
    };

    const signed = await provider.signDirect(
      chainInfo.chainId,
      sender,
      signDoc,
    );

    const signedTx = {
      tx: TxRaw.encode({
        bodyBytes: signed.signed.bodyBytes,
        authInfoBytes: signed.signed.authInfoBytes,
        // @ts-ignore
        signatures: [Buffer.from(signed.signature.signature, "base64")],
      }).finish(),
      signDoc: signed.signed,
    };
    const txHash = await broadcastTxSync(
      provider,
      chainInfo.chainId,
      signedTx.tx,
    );
    const txTracer = new TendermintTxTracer(chainInfo.rpc, "/websocket");
    txTracer.traceTx(txHash).then((tx: any) => {
      console.log("tx  : ", tx);
      return tx;
    });
  }
};

export const fetchAccountInfo = async (
  chainInfo: ChainInfo,
  address: string,
) => {
  try {
    const uri = `${chainInfo.rest}/cosmos/auth/v1beta1/accounts/${address}`;
    const response = await httpReqest(uri, "GET", null);
    if (!response?.error) {
      return response?.data?.account.base_account;
    }
    return null;
  } catch (e) {
    console.error(
      "This may be a new account. Please send some tokens to this account first.",
    );
    return undefined;
  }
};

export const broadcastTxSync = async (
  wallet: any,
  chainId: string,
  tx: Uint8Array,
): Promise<Uint8Array> => {
  return wallet.sendTx(chainId, tx, "sync" as BroadcastMode);
};
