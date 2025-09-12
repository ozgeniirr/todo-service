declare module "nodemailer-otp" {
  class NodemailerHelper {
    constructor(user: string, pass: string);
    generateOtp(length: number): string;
    sendEmail(to: string, subject: string, text: string, otp: string): Promise<void>;
  }
  export = NodemailerHelper;
}
