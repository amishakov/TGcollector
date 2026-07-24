import getAction from "helpers/getAction";

describe("getAction", () => {
  test("returns message for channel creation action", () => {
    expect(
      getAction({
        className: "MessageActionChannelCreate",
        title: "My Channel",
      }),
    ).toBe("Channel created with the name: My Channel");
  });

  test("returns message for chat title edit action", () => {
    expect(
      getAction({
        className: "MessageActionChatEditTitle",
        title: "New Name",
      }),
    ).toBe("Channel name changed to: New Name");
  });

  test("returns empty string for unsupported actions", () => {
    expect(getAction({ className: "UnknownAction" })).toBe("");
    expect(getAction()).toBe("");
  });
});
