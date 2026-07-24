import dayjs from "dayjs";
import { reshapeMessages } from "helpers/reshapeMessages";

describe("reshapeMessages", () => {
  test("maps requested fields and derives helper values", () => {
    const fields = [
      "date",
      "editDate",
      "replies",
      "messageLink",
      "fwdFrom",
      "reactions",
      "entities",
      "message",
    ];

    const chats = [{ id: { value: 777 }, username: "source_channel" }];
    const channel = "target_channel";

    const item = {
      id: 42,
      date: 1700000000,
      editDate: 1700000100,
      replies: { replies: 3 },
      fwdFrom: {
        originalArgs: {
          fromId: { className: "PeerChannel", channelId: 777 },
          channelPost: 12,
        },
      },
      reactions: {
        results: [{ reaction: { emoticon: "👍" }, count: 2 }],
      },
      entities: [
        { className: "MessageEntityTextUrl", url: "https://example.com" },
        { className: "MessageEntityBold" },
      ],
      message: "hello",
      className: "Message",
      action: {
        className: "MessageActionChannelCreate",
        title: "News",
      },
    };

    const result = reshapeMessages(fields, chats, channel)(item);

    expect(result).toEqual(
      expect.objectContaining({
        date: dayjs.unix(1700000000).toISOString(),
        editDate: dayjs.unix(1700000100).toISOString(),
        replies: 3,
        messageLink: "https://t.me/target_channel/42",
        fwdFrom: {
          fwd_channel: "source_channel",
          fwd_message: "https://t.me/source_channel/12",
        },
        reactions: { "_👍": 2 },
        entities: ["https://example.com"],
        message: "hello",
        channel: "target_channel",
        className: "Message",
        action: "Channel created with the name: News",
      }),
    );
  });

  test("handles empty and missing optional fields", () => {
    const fields = [
      "editDate",
      "replies",
      "fwdFrom",
      "reactions",
      "entities",
      "message",
    ];
    const item = {
      id: 1,
      className: "Message",
      action: {},
    };

    const result = reshapeMessages(fields, [], "channel_x")(item);

    expect(result).toEqual(
      expect.objectContaining({
        editDate: "",
        replies: 0,
        fwdFrom: "",
        reactions: "",
        entities: [],
        message: "",
        action: "",
      }),
    );
  });
});
