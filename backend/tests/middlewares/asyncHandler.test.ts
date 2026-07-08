import { Request, Response, NextFunction } from "express";
import asyncHandler from "~/middlewares/asyncHandler.ts";

describe("asyncHandler", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it("should call the async function", async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);

    await handler(req as Request, res as Response, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it("should call res.json with data", async () => {
    const fn = async (req: Request, res: Response) => {
      res.json({ message: "success" });
    };
    const handler = asyncHandler(fn);

    await handler(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({ message: "success" });
  });

  it("should call next when async function throws error", async () => {
    const error = new Error("Something went wrong");
    const fn = async () => {
      throw error;
    };
    const handler = asyncHandler(fn);

    await handler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should call next with rejected promise error", async () => {
    const error = new Error("Promise rejected");
    const fn = jest.fn().mockRejectedValue(error);
    const handler = asyncHandler(fn);

    await handler(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should handle synchronous function", async () => {
    const fn = async (req: Request, res: Response) => {
      res.json({ data: 123 });
    };
    const handler = asyncHandler(fn);

    handler(req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({ data: 123 });
    expect(next).not.toHaveBeenCalled();
  });

  it("should not call next when function succeeds", async () => {
    const fn = async (req: Request, res: Response) => {
      res.json({ ok: true });
    };
    const handler = asyncHandler(fn);

    await handler(req as Request, res as Response, next);

    expect(next).not.toHaveBeenCalled();
  });
});
