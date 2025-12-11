const { createServer, request } = require('http')
const { parse } = require('url')
const WebSocket = require('ws')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = 3000
const wsPort = 3001

app.prepare().then(() => {

  const server = createServer((req, res) => {
    const parseUrl = parse(req.url, true)
    handle(res, req, parseUrl)
  })

  const wsServer = createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('WebSocket Server')
  })

  const wss = new WebSocket.Server({ server: wsServer })

  const rooms = new Map()


  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const roomId = url.searchParams.get('roomId')
    const userId = url.searchParams.get('userId')

    if (!roomId || !userId) {
      ws.close()
      return
    }

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    rooms.get(roomId).add(ws)

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message)

        if (data.type === 'message') {
          const room = rooms.get(roomId)
          if (room) {
            room.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'message',
                  userId: userId,
                  displayName: data.displayName,
                  content: data.content,
                  createdAt: new Date().toISOString()
                }))
              }
            });
          }
        }
      } catch (err) {
        console.log(err)
      }
    })

    ws.on('close', () => {
      const room = rooms.get(roomId)
      if (room) {
        room.delete(ws)
      }
      if (room.size === 0) {
        rooms.delete(roomId)
      }
    })

  })
  
  wsServer.listen(wsPort, (err) => {
    if (err) throw err;
    console.log(`WS server on http://localhost:${wsPort}`);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
})
