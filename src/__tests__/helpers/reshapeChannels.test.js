import { reshapeChannels } from "helpers/reshapeChannels";

describe("reshapeChannels", () => {
  test("prefers explicit handle and reshapes channel fields", () => {
    const item = {
      handle: "custom_handle",
      data: {
        fullChat: {
          id: { value: "123" },
          about: "About channel",
          participantsCount: 987,
        },
        chats: [
          {
            id: { value: "123" },
            username: "chat_username",
            title: "Channel title",
            date: "2024-01-01",
          },
        ],
      },
    };

    expect(reshapeChannels(item)).toEqual({
      id: 123,
      username: "custom_handle",
      about: "About channel",
      title: "Channel title",
      creationDate: "2024-01-01",
      participantsCount: 987,
    });
  });

  test("falls back to chat username and default about value", () => {
    const item = {
      handle: "",
      data: {
        fullChat: {
          id: { value: "10" },
          about: "",
          participantsCount: 4,
        },
        chats: [
          {
            id: { value: "10" },
            username: "fallback_name",
            title: "Fallback title",
            date: "2023-03-11",
          },
        ],
      },
    };

    expect(reshapeChannels(item)).toEqual({
      id: 10,
      username: "fallback_name",
      about: "-",
      title: "Fallback title",
      creationDate: "2023-03-11",
      participantsCount: 4,
    });
  });
});
