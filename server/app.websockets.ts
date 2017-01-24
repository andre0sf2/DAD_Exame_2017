const io = require('socket.io');

export class WebSocketServer {
    public board: number[] = [];
    public io: any;

    public init = (server: any) => {
        //this.initBoard();
        this.io = io.listen(server);            
        this.io.sockets.on('connection', (client: any) => {
            client.emit('players', Date.now() + ': Welcome to Sueca Online');
            client.broadcast.emit('players', Date.now() + ': A new player has arrived');
            client.on('lobby-chat', (data) => this.io.emit('lobby-chat', data));
            
            //Extra Exercise
            client.emit('board', this.board);
            client.on('clickElement', (indexElement) => {
                this.board[indexElement]++;
                if (this.board[indexElement] > 2) {
                    this.board[indexElement] = 0;
                }
                this.notifyAll('board', this.board);
            });

        });
    };
   public notifyAll = (channel: string, message: any) => {
        this.io.sockets.emit(channel, message);
    }; 
};
