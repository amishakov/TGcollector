import { getClient } from "client/getClient";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

jest.mock("telegram", () => ({
  TelegramClient: jest.fn(),
}));

jest.mock("telegram/sessions", () => ({
  StringSession: jest.fn(),
}));

describe("getClient", () => {
  let mockConnect;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConnect = jest.fn().mockResolvedValue(true);
    TelegramClient.mockImplementation(() => ({
      connect: mockConnect,
    }));
    StringSession.mockImplementation(() => ({}));
  });

  it("should connect and return client if valid user info is provided", async () => {
    const user = {
      api: "12345,myhash",
      session: "sessionstring",
    };
    const client = await getClient(user);
    expect(StringSession).toHaveBeenCalledWith("sessionstring");
    expect(TelegramClient).toHaveBeenCalledWith(expect.any(Object), 12345, "myhash", {
      connectionRetries: 3,
    });
    expect(mockConnect).toHaveBeenCalled();
    expect(client).toBeDefined();
  });

  it("should log error and return undefined/null if connection fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    mockConnect.mockRejectedValue(new Error("connect failed"));
    const user = {
      api: "12345,myhash",
      session: "sessionstring",
    };
    
    const client = await getClient(user);
    expect(consoleSpy).toHaveBeenCalledWith("Client connection error.", expect.any(Error));
    expect(client).toBeNull();
    
    consoleSpy.mockRestore();
  });

  it("should return null if user params are invalid", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const user = {
      api: "",
      session: "",
    };
    
    const client = await getClient(user);
    expect(consoleSpy).toHaveBeenCalledWith("Client connection error. id, hash and session must be provided.");
    expect(client).toBeNull();
    
    consoleSpy.mockRestore();
  });
});
