export type Letter = {
  id: string;
  author: string;
  recipient: string;
  body: string;
  scheduledAt: Date;
  sentAt: Date;
  attachment: string;
};
