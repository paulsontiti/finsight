import crypto from "crypto";
import type { PaymentUseCase } from "../application/use-cases/payment.usecase.js";

export class WebhookController {
  constructor(private paymentUseCase: PaymentUseCase | any) {}

  async handle(req: any, res: any) {
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET!)
      .update(JSON.stringify(req.body))
      .digest("hex");

<<<<<<< HEAD
    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature")
=======
      let hash;
        const config = container.resolve<any>("configService");
  const payStackSecret = config.get("PAYSTACK_SECRET");//
      
      try{
        hash = crypto
        .createHmac("sha512", payStackSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");
      }catch(err:any){
        console.log(err.message)
      }

      // 🔐 1. VERIFY SIGNATURE
      if (hash !== signature) {
        return res.status(401).send("Invalid signature");
      }

      const event = req.body;

  
       // 🧠 2. STORE EVENT (CRITICAL)
      await this.webhookRepo.createEvent({
        provider: "paystack",
        eventType: event.event,
        reference: event.data.reference,
        payload: event
      });

      // ✅ 3. RESPOND FAST (VERY IMPORTANT)
      return res.sendStatus(200);
    
    } catch (error) {
      return res.status(500);
>>>>>>> c443c4c (feat: build resilient webhook processing system with event logging, retry logic, and failure recovery)
    }

    const event = req.body;

    if (event.event === "charge.success") {
      await this.paymentUseCase.execute(event.data);
    }

    res.sendStatus(200);
  }
}