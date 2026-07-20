export const SEPAY_CONFIG = {
  API_TOKEN: process.env.SEPAY_API_TOKEN || "",
  BANK_ACCOUNT: process.env.SEPAY_BANK_ACCOUNT || "",
  BANK_NAME: process.env.SEPAY_BANK_NAME || "Vietcombank",
  WEBHOOK_SECRET: process.env.SEPAY_WEBHOOK_SECRET || "",
};

export interface SepayTransaction {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  subAccount: string | null;
  code: string | null;
  content: string;
  transferType: "in" | "out";
  description: string;
  transferAmount: number;
  accumulated: number;
  referenceCode: string;
}

export interface SepayWebhookPayload extends SepayTransaction {
  success?: boolean;
}
