const socket = io()

socket.on('connection',() =>{
    console.log("connected")
})


let prod = [];
socket.on('products', (data) => {
    prod = data;
    let htmlToRender = '';

    for (let i = 0; i < prod.length; i++) {
        htmlToRender = htmlToRender +`
        <tr>
        <td> <h1> ${prod[i].title} </h1> </td>
        <td> <h1> ${prod[i].price} </h1> </td>
        <img class="image" src=${prod[i].thumbnail} />
        </tr>
        ` , ''
        
    }
    document.querySelector("#products").innerHTML = htmlToRender

})

socket.on('chat', (msg) => {
    let chatReduce = msg.reduce((prevHtml, currentHtml) => prevHtml + `
    <tr>
    <td> <b class="email"> ${currentHtml.email} </b> </td>
    <td> <span class="date"> ${currentHtml.date} </span> </td>
    <td> <span class="text">${currentHtml.message}<span/> </td>
    </tr>
    `,'')
    document.querySelector('#messageChat').innerHTML = chatReduce
})

function addMessage(addMessage){
    let messageToAdd = {
        email: addMessage.email.value,
        message: addMessage.message.value,
        date: new Date().toLocaleDateString()
    }

    socket.emit('newMessage', messageToAdd)
}



function addProduct(addProduct){
    console.log(prod)
    
    let product = {
        title: addProduct.title.value,
        price: addProduct.price.value,
        thumbnail: addProduct.thumbnail.value
    }

    let lastId = prod[prod.length - 1]
    if(product){
        product.id = lastId + 1
        prod.push(product)
    }

    socket.emit('addProduct', product)
}