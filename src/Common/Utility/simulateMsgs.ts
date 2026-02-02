import {
  Fee,
  TxRaw,
  TxBody,
  AuthInfo,
  SignerInfo,
} from "../../proto-types-gen/src/cosmos/tx/v1beta1/tx";
import { CHAIN_INFO } from "../constants";
import { httpReqest } from "../httpRequest";
import { fetchAccountInfo } from "./sendMsgs";
import { ChainInfo } from "@keplr-wallet/types";
import { Any } from "../../proto-types-gen/src/google/protobuf/any";
import { SignMode } from "../../proto-types-gen/src/cosmos/tx/signing/v1beta1/signing";

export const simulateMsgs = async (
  chainInfo: ChainInfo,
  sender: string,
  proto: Any[],
  fee: [
    {
      denom: string;
      amount: string;
    },
  ],
  memo: string = "",
) => {
  const account = await fetchAccountInfo(chainInfo, sender);
 
  if (account) {
    const unsignedTx = TxRaw.encode({
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          messages: proto,
          memo,
        }),
      ).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          SignerInfo.fromPartial({
            // Pub key is ignored.
            // It is fine to ignore the pub key when simulating tx.
            // However, the estimated gas would be slightly smaller because tx size doesn't include pub key.
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_DIRECT,
              },
              multi: undefined,
            },
            sequence: account.sequence,
          }),
        ],
        fee: Fee.fromPartial({
          amount: fee.map((coin) => {
            return {
              denom: coin.denom,
              amount: coin.amount.toString(),
            };
          }),
        }),
      }).finish(),
      // Because of the validation of tx itself, the signature must exist.
      // However, since they do not actually verify the signature, it is okay to use any value.
      signatures: [new Uint8Array(64)],
    }).finish();

    const simulatedResult = await httpReqest(
      `${chainInfo.rest}/cosmos/tx/v1beta1/simulate`,
      "POST",
      JSON.stringify({
        tx_bytes: Buffer.from(unsignedTx).toString("base64"),
      }),
    );

    if (!simulatedResult?.error) {
      const gasUsed = parseInt(simulatedResult?.data?.gas_info.gas_used);
      if (Number.isNaN(gasUsed)) {
        throw new Error(
          `Invalid integer gas: ${simulatedResult?.data?.gas_info.gas_used}`,
        );
      }

      return {
        error: simulatedResult?.error,
        status: simulatedResult?.status,
        gasUsed: gasUsed,
      };
    } else {
      return simulatedResult;
    }
  }

  return undefined;
};
