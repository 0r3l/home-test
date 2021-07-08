type Server = 'S1' | 'S2' | 'S3';


export class LoadBalancer {

  private servers: Server[] = ['S1', 'S2', 'S3'];
  private serversAvailability: boolean[] = this.servers.map(_ => true);
  private clientsToservers: Map<string, Server> = new Map();
  private _serversSizes: number[] = new Array(this.servers.length).fill(0);

  get serversSizes(){
    // immutable
    return [...this._serversSizes];
  }

  forward(clientId: string): Server {
    // sticky
    const server = this.clientsToservers.get(clientId) as Server;

    const isServerUp =  this.serversAvailability[this.servers.indexOf(server)];


    if (!server || !isServerUp) {
      const minServer = this.getMinServer();
      this.clientsToservers.set(clientId, minServer);
      ++this._serversSizes[this.servers.indexOf(minServer)]
      return minServer;
    }

    return server;
  }

  // availability
  onServerDown(s: Server) {
    const index = this.servers.indexOf(s);
    this.serversAvailability[index] = false;
    this._serversSizes[index] = Number.MAX_SAFE_INTEGER;
  }

  onServerUp(s: Server) {
    const index = this.servers.indexOf(s);
    this.serversAvailability[index] = true;
    this._serversSizes[index] = 0;
  }

  // fair
  private getMinServer() {
    const minIndex = this._serversSizes.indexOf(Math.min(...this._serversSizes));
    return this.servers[minIndex];
  }


}
