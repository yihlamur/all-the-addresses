import { useWeb3React } from "@web3-react/core";
import type { NextPage } from "next";
import Web3 from "web3";
import { injected } from "../components/wallets/connectors";
import styles from "../styles/Home.module.css";
// import QrReader from "react-qr-reader";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AbiItem } from "web3-utils";
import { Contract } from "web3-eth-contract";

// Assumes a deployed contract address. #HACKATHON
const contractAddress = "0x26Ef401c4f625E7970278441518e3Eed49787Ac0";
import contractAbi from "../../build/contracts/PhysicalAddressValidation.json";
// We will somehow need to get the abi

const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

interface QrCode {
  publicKey: string;
  nonce: string;
  physicalAddressHash: string;
  addressMetadata: string;
  notsecurenonce: string;
  proofOfAddressSignature: string;
}

const Home: NextPage = () => {
  const { active, account, activate, deactivate, library } =
    useWeb3React<Web3>();
  const connect = async () => activate(injected);
  const disconnect = async () => deactivate();
  const [contract, setContract] = useState<Contract>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isScanned, setIsScanned] = useState<boolean>(false);

  //   useEffect(() => {
  //     (async function () {
  //       console.log("before dom exception?");
  //       const algorithm = "ES256";
  //       const spki = `-----BEGIN PUBLIC KEY-----
  // MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu3UssCaCigKP2nzLcgDz
  // ItCsIdqo+QpKFw1zLHzCy900xOYC4GyKxoss0YXSgUATi4zanYY7nIF5D2Nn5t3+
  // WCauML346vwpmk4WdJcVo4x5dYAZ8ZEMeI7ZLkTyhaxe56oVjszkceW2Hj9PCjxO
  // jguz/+50OFJaljzJmQc3MTG8+fNx3tlh2/AR+KWAPxw6SSGCeRjWwrxSB8X+bRWZ
  // lwufpkfz22z0i71Yt5ABY/323OMOsVVHu6kdperSmybKkVjNzFnISyjIxi9YEKhh
  // 0Si9uh9gKopvFyuE/BnLrZ48YP3v3cTNV/rRy804Z7AUD9I0JKNah0oTLiY4ynwZ
  // IQIDAQAB
  // -----END PUBLIC KEY-----`;
  //       const ecPublicKey = await jose.importSPKI(spki, algorithm);
  //       console.log("ecPublicKey", ecPublicKey);
  //     })();
  //   }, []);

  useEffect(() => {
    if (!library) return;

    (async function getContract() {
      const contract = new library!.eth.Contract(
        contractAbi.abi as unknown as AbiItem,
        contractAddress
      );
      setContract(contract);
    })();
  }, [library]);
  console.log("contract", contract);
  const mapAddress = async (qrCode: QrCode) => {
    // const { physicalAddressHash, notsecurenonce, proofOfAddressSignature } =
    //   qrCode;
    const physicalAddressHash = "27 South Park";
    const notsecurenonce =
      BigInt(
        91903244880640089683750221547850482788364732980300540907126097277003523592996
      );
    // const proofOfAddressSignature = library?.eth.abi.encodeParameters(
    //   ["string", "uint256"],
    //   [
    //     physicalAddressHash,
    //     9106623947899129220758414257994314916107783387136329768872248772220295369560,
    //   ]
    // );
    // console.log(physicalAddressHash, notsecurenonce, proofOfAddressSignature);
    // const theActualPayload = library?.eth.sign(
    //   proofOfAddressSignature,
    //   account
    // );
    try {
      await contract?.methods
        .registerAddress(physicalAddressHash, notsecurenonce)
        .send({ from: account, gas: 2100000 })
        .on(
          "receipt",
          (thing) => console.log("thing", thing) || setIsConfirmed(true)
        );
    } catch (error) {
      console.log("error", error);
      console.log("error", (error as any).data);
      const message = JSON.parse(
        (error as any).message.substring(15).trim()
      ).message;
      console.log("message", message);
    }
  };

  // Scan a QR code
  // Input the QR code data into a form (optional?)
  // Upon QR scan (plus some data validation), initiate a call to the contract via Metamask
  return (
    <div className={styles.container}>
      {active ? (
        <button onClick={disconnect}>Disconnect from Metamask</button>
      ) : (
        <button onClick={connect}>Connect to Metamask</button>
      )}
      <p>{active ? `Connected with ${account}` : "not connected"}</p>
      {!isScanned && (
        <QrReader
          delay={300}
          onError={(error: any) => console.error(error)}
          onScan={async (data: any) => {
            if (!data || isScanned) return;
            setIsScanned(true);
            // The data will be signed with a private key
            // Verify this using the public key
            // setQrCode(JSON.parse(data) as QrCode);
            const qrCode = JSON.parse(data) as QrCode;
            await mapAddress(qrCode);
          }}
          style={{ width: "20%" }}
        />
      )}

      <button
        onClick={async () => {
          mapAddress({} as QrCode);
        }}
      >
        test
      </button>
      {isConfirmed && <div>OMG congrats, we did it team!</div>}
    </div>
  );
};

export default Home;
