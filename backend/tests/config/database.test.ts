import mongoose from "mongoose";

jest.mock("~/config/env.ts", () => ({
  __esModule: true,
  default: {
    URL_MONGODB: "mongodb://localhost:27017/testdb",
  },
}));

jest.mock("mongoose", () => {
  const mockConnect = jest.fn();
  const mockConnection = {
    host: "localhost",
    name: "testdb",
  };
  return {
    __esModule: true,
    default: {
      connect: mockConnect,
      connection: mockConnection,
    },
  };
});

const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {
  return undefined as never;
});
const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, "error").mockImplementation(() => {});

import connectDatabase from "~/config/database.ts";

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockExit.mockRestore();
  mockConsoleLog.mockRestore();
  mockConsoleError.mockRestore();
});

describe("connectDatabase", () => {
  it("should connect to MongoDB successfully", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({
      connection: { host: "localhost", name: "testdb" },
    });

    await connectDatabase();

    expect(mongoose.connect).toHaveBeenCalledWith("mongodb://localhost:27017/testdb");
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });

  it("should log connection info on successful connection", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({
      connection: { host: "localhost", name: "testdb" },
    });

    await connectDatabase();

    expect(mockConsoleLog).toHaveBeenCalledWith("MongoDB connected: localhost/testdb");
  });

  it("should call process.exit(1) when connection fails", async () => {
    const error = new Error("Connection refused");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await connectDatabase();

    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should log error message when connection fails", async () => {
    const error = new Error("Connection refused");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await connectDatabase();

    expect(mockConsoleError).toHaveBeenCalledWith("MongoDB connection error:", "Connection refused");
  });

  it("should not log success message when connection fails", async () => {
    const error = new Error("Connection refused");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await connectDatabase();

    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it("should handle different host and database names", async () => {
    (mongoose.connect as jest.Mock).mockResolvedValueOnce({
      connection: { host: "cluster0.example.com", name: "production" },
    });

    await connectDatabase();

    expect(mockConsoleLog).toHaveBeenCalledWith("MongoDB connected: cluster0.example.com/production");
  });

  it("should handle network timeout error", async () => {
    const error = new Error("Server selection timed out");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await connectDatabase();

    expect(mockConsoleError).toHaveBeenCalledWith("MongoDB connection error:", "Server selection timed out");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should handle authentication error", async () => {
    const error = new Error("Authentication failed");
    (mongoose.connect as jest.Mock).mockRejectedValueOnce(error);

    await connectDatabase();

    expect(mockConsoleError).toHaveBeenCalledWith("MongoDB connection error:", "Authentication failed");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should handle error without message property", async () => {
    (mongoose.connect as jest.Mock).mockRejectedValueOnce("string error");

    await connectDatabase();

    expect(mockConsoleError).toHaveBeenCalledWith("MongoDB connection error:", undefined);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
