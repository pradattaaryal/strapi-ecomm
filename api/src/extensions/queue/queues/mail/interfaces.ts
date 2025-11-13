export interface IMailPayload {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  attachments?: any[];
  headers?: Record<string, string>;
}

export interface IBulkMailPayload {
  emails: IMailPayload[];
}