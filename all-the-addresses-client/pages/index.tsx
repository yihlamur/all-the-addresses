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
const contractAddress = "0x6024A9F2A435651b28DC9ecc6E8AB0D59dA12F67";
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
    const { physicalAddressHash, notsecurenonce, proofOfAddressSignature } =
      qrCode;
    console.log(physicalAddressHash, notsecurenonce, proofOfAddressSignature);
    try {
      await contract?.methods
        .registerAddress("physicalAddressHash", 1234, 0x1234123)
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
