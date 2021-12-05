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

const contractAddress = "0x66c99c42e3Ebf685888696e990272092d8d5B82D";
import contractAbi from "../../build/contracts/PhysicalAddressValidation.json";

const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

interface QrCode {
  physicalAddressHash: string;
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
    const { physicalAddressHash, notsecurenonce } = qrCode;
    try {
      await contract?.methods
        .registerAddress(physicalAddressHash, notsecurenonce)
        .send({ from: account, gas: 2100000 })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(confirmationNumber, receipt);
          setIsConfirmed(true);
        });
    } catch (error) {
      console.error(error);
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
            const qrCode = JSON.parse(data) as QrCode;
            await mapAddress(qrCode);
          }}
          style={{ width: "20%" }}
        />
      )}
      {isConfirmed && <div>OMG congrats, we did it team!</div>}
    </div>
  );
};

export default Home;
