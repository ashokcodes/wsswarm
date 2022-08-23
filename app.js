let counter = 0

const { program } = require('commander')

function connectSocket(counter, host, origin) {
    const socket = require('socket.io-client')(host, {
        transports: ['websocket'], query: 'user={"agentID": ' + counter + '}', extraHeaders: {
            origin: origin
        }
    })
    socket.on('connect', function () {
        console.log('Connected! ', counter)
    })
    socket.on('error', function () {
        console.log("Sorry, there seems to be an issue with the connection!");
    })
    socket.on('event', function () { })
    socket.on('disconnect', function () {
        console.log("Disconnected Socket ")
    })
}

let upperLimit

async function main() {

    program
        .requiredOption('-c, --max-connections <maxConnections>', 'Number of socket connections')
        .option('-h, --host <host>', 'Socket server endpoint')
        .option('-o, --origin <origin>', 'Origin headers sent to socket server');

    program.parse(process.argv)

    const options = program.opts()

    upperLimit = ~~(options.maxConnections) ?? 10
    const host = options.host ?? 'http://127.0.01'
    const origin = options.origin ?? host

    console.table({ maxConnections: upperLimit, host, originHeader: origin })

    setInterval(() => {
        counter++
        if (counter <= upperLimit)
            connectSocket(counter, host, origin)
    }, 100)
}

main()