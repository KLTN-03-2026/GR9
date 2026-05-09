import dotenv from "dotenv";
import { PayOS } from "@payos/node";

dotenv.config();

let payOSClient = null;

export const getPayOSClient = () => {
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

  if (!clientId || !apiKey || !checksumKey) {
    const error = new Error(
      "Missing PayOS configuration. Please set PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY in Backend/.env.",
    );
    error.status = 500;
    error.errorCode = "PAYOS_CONFIG_MISSING";
    throw error;
  }

  if (!payOSClient) {
    payOSClient = new PayOS({
      clientId,
      apiKey,
      checksumKey,
    });
  }

  return payOSClient;
};

export default getPayOSClient;
