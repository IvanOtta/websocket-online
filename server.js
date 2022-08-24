const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const PORT = 8080;
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer,{
  cors: {origin: "*"}
});

app.use(express.json())
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended:true }))
app.use('/public', express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', './views');


const server = httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});

server.on('error', (error) => console.log(`Error en servidor ${error}`));

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

const productsArg = [
  { id: 1, title: 'Camiseta Argentina Qatar 2022', price: 18000, thumbnail: 'http://localhost:8080/public/camiseta-adidas-argentina-2022-3.jpg'  },
  { id: 2, title: 'Pelota Qatar 2022', price: 45000 , thumbnail: 'http://localhost:8080/public/pelota-qatar-2022-adidas-al-rihla-league-box-replica-numero-5-blanca-100040h57782001-1.jpg'  },
  { id: 3, title: 'Botines adidas Lionel Messi x Speedflow', price: 19000 , thumbnail: 'http://localhost:8080/public/messi-botines-2022-adidas-x-speedflow-mi-historia-nm.jpg'  }
]

let chat = [
  {
    email: " ",
    message: " ",
    date: ''
  }
]

app.get('/', (req, res) => {
  //sirve productslist.hbs en index.hbs (index.hbs es la plantilla por defecto donde arranca todo)
  res.render('productslist', { root: __dirname + '/public' });
});

io.on('connection', (socket) => {
  console.log("new connection!")
  io.sockets.emit('products', productsArg)
  io.sockets.emit('chat', chat);

  socket.on('newMessage', (msg) => {
    chat.push(msg);
    io.sockets.emit('chat', chat)
  });

  socket.on('addProduct', (data) => {
    productsArg.push(data);
    io.sockets.emit('products', productsArg)
  });
});

