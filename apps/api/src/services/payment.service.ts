import axios from "axios";

export class PaystackService {
  private baseUrl = "https://api.paystack.co";

  constructor(private payStackSecret:string){}

  async initializePayment(data: {
    email: string;
    amount: number; // in kobo
    reference: string;
    callback_url?: string;
  }) {
    const res = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.payStackSecret}`
        }
      }
    );

    return res.data.data; // authorization_url, reference
  }
}