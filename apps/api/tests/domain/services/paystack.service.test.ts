import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { PaystackService } from "../../src/services/payment.service";
import { container } from "../../src/shared/container/index";

vi.mock("axios");

const config = container.resolve<any>("configService");
const payStackSecret = config.get("PAYSTACK_SECRET")

const service = new PaystackService(payStackSecret);

describe("Paystack Service", () => {
  it("should initialize payment and return authorization url", async () => {
    (axios.post as any).mockResolvedValue({
      data: {
        data: {
          authorization_url: "https://paystack.com/pay/test",
          reference: "ref_123",
        },
      },
    });

    const result = await service.initializePayment({
      email: "test@mail.com",
      amount: 1000,
      reference: "ref_123",
    });
    expect(result.authorization_url).toBeDefined();
  });

  it("should send authorization header", async () => {
    (axios.post as any).mockResolvedValue({ data: { data: {} } });

    await service.initializePayment({
      email: "test@mail.com",
      amount: 1000,
      reference: "ref_123",
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining("Bearer"),
        }),
      }),
    );
  });

  it("should throw if paystack fails", async () => {
    (axios.post as any).mockRejectedValue(new Error("network error"));

    await expect(
      service.initializePayment({
        email: "test@mail.com",
        amount: 1000,
        reference: "ref_123",
      }),
    ).rejects.toThrow();
  });
});
