import dotenv from "dotenv";
import { PayOS } from "@payos/node";

dotenv.config();

const payOS = new PayOS({
  clientId: process.env.CLIENT_ID,
  apiKey: process.env.API_KEY,
  checksumKey: process.env.CHECKSUM_KEY,
});

export default payOS;
