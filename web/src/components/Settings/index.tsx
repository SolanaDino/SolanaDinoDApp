import React from "react";
import { Button, Select } from "antd";
import { ENDPOINTS } from "../../contexts/connection";
import { useWallet } from "@solana/wallet-adapter-react";

export const Settings = () => {
  const { connected, disconnect } = useWallet();
  // const { endpoint, setEndpoint } = useConnectionConfig();

  return <>{/* <WalletMultiButton /> */}</>;
};
