import { foldersReducer } from "helpers/foldersReducer";

describe("foldersReducer", () => {
  const dialogs = [
    {
      entity: {
        id: { value: 111 },
        username: "channel_one",
        title: "Channel One",
        date: "2023-01-01",
        participantsCount: 100,
      },
      message: { message: "last message" },
    },
    {
      entity: {
        id: { value: 222 },
        username: "",
        title: "No Username",
        date: "2023-01-02",
        participantsCount: 20,
      },
      message: { message: "hidden" },
    },
  ];

  test("includes only matching InputPeerChannel entries with usernames", () => {
    const folder = {
      toJSON: () => ({
        id: 5,
        title: "Folder 5",
        includePeers: [
          { className: "InputPeerChannel", channelId: { value: 111 } },
          { className: "InputPeerChannel", channelId: { value: 222 } },
          { className: "InputPeerUser", userId: { value: 1 } },
        ],
      }),
    };

    const result = foldersReducer(dialogs)({}, folder);

    expect(result).toEqual({
      f5: {
        id: 5,
        title: "Folder 5",
        channels: [
          {
            id: 111,
            username: "channel_one",
            lastMessage: "last message",
            title: "Channel One",
            creationDate: "2023-01-01",
            participantsCount: 100,
          },
        ],
      },
    });
  });

  test("merges reduced folder into accumulator without mutating previous keys", () => {
    const folder = {
      toJSON: () => ({
        id: 9,
        title: "New Folder",
        includePeers: [],
      }),
    };

    const previous = { f1: { id: 1, title: "Existing", channels: [] } };
    const result = foldersReducer(dialogs)(previous, folder);

    expect(result.f1).toEqual(previous.f1);
    expect(result.f9).toEqual({ id: 9, title: "New Folder", channels: [] });
    expect(result).not.toBe(previous);
  });
});
