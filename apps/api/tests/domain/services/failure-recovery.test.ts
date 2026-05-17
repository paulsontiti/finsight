import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { FailureRecoveryService } from "../../src/services/failure-recovery.service"

describe(
  "FailureRecoveryService",
  () => {
    let deadLetterQueue: any;

    let service: FailureRecoveryService;

    beforeEach(() => {
      deadLetterQueue = {
        add: vi.fn(),
      };

      service =
        new FailureRecoveryService(
          deadLetterQueue,
        );
    });

    // ✅ MOVE FAILED JOB TO DLQ
    it(
      "should move failed job to dead letter queue",
      async () => {
        await service.handleJobFailure(
          {
            data: {
              reference:
                "ref_123",
            },
          },

          new Error(
            "Webhook failed",
          ),
        );

        expect(
          deadLetterQueue.add,
        ).toHaveBeenCalled();
      },
    );

    // ✅ STORE FAILURE REASON
    it(
      "should store failure reason",
      async () => {
        await service.handleJobFailure(
          {
            data: {},
          },

          new Error(
            "Redis crash",
          ),
        );

        expect(
          deadLetterQueue.add,
        ).toHaveBeenCalledWith(
          "failed-job",

          expect.objectContaining(
            {
              reason:
                "Redis crash",
            },
          ),

          expect.any(Object),
        );
      },
    );

    // 🚨 DLQ FAILURE
    it(
      "should throw if dead letter queue fails",
      async () => {
        deadLetterQueue.add.mockRejectedValue(
          new Error(
            "DLQ unavailable",
          ),
        );

        await expect(
          service.handleJobFailure(
            {
              data: {},
            },

            new Error("Failure"),
          ),
        ).rejects.toThrow(
          "DLQ unavailable",
        );
      },
    );
  },
);