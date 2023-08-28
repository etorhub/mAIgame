import {
  Character,
  InworldClient,
  InworldConnectionService,
  InworldPacket,
} from "@inworld/nodejs-sdk";

class InWorldClient {
  public connection: InworldConnectionService<InworldPacket>;

  constructor() {
    const client = new InworldClient()
      // Get key and secret from the integrations page.
      .setApiKey({
        key: process.env.INWORLD_KEY!,
        secret: process.env.INWORLD_SECRET!,
      })
      // Setup a user name.
      // It allows character to call you by name.
      .setUser({ fullName: "Your name" })
      // Setup required capabilities.
      // In this case you can receive character emotions.
      .setConfiguration({
        capabilities: { audio: true, emotions: true },
      })
      // Use a full character name.
      // It should be like workspaces/{WORKSPACE_NAME}/characters/{CHARACTER_NAME}.
      // Or like workspaces/{WORKSPACE_NAME}/scenes/{SCENE_NAME}.
      .setScene(process.env.INWORLD_SCENE!)
      // Attach handlers
      .setOnError((err: Error) => console.error(err))
      .setOnMessage((packet: InworldPacket) => {
        console.log(packet);

        if (packet.isInteractionEnd()) {
          // Close connection.
          connection.close();
        }
      });

    // Finish connection configuration.
    const connection = client.build();

    this.connection = connection;
  }

  public async sayHello({ text }: { text: string }): Promise<InworldPacket> {
    // Send your message to a character.
    const hello = await this.connection.sendText(text);
    return hello;
  }

  public async getCharacters(): Promise<Character[]> {
    // Get characters list.
    const characters = await this.connection.getCharacters();

    return characters;
  }
}

const inWorldClient = new InWorldClient();

export default inWorldClient;
