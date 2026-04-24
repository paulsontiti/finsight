import type { IMailer } from "../shared/types/index.js";
export declare class MockMailer implements IMailer {
    send(data: {
        to: string;
        subject: string;
        body: string;
    }): Promise<void>;
}
//# sourceMappingURL=mock-mailer.service.d.ts.map