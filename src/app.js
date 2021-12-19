const express = require("express");
const path = require("path");
const ListaProdutos = require("./teste.json");
const ListaAdicionais = require("./adicionais.json");
const helmet = require("helmet");
const cors = require("cors");



const app = express();
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(express.static(__dirname + '/assets'));

app.get("/produtos", function (req, res) {
  const { categoria } = req.query;
  let filteredProducts = [];
  if (categoria) {
    for (let i of ListaProdutos) {
      if (i.titulo.toUpperCase() == categoria.toUpperCase()) {
        filteredProducts.push(i.produtos);
      }
    }
    return res.json({
      dadosDaLoja:{
        titulo: "Sandra's Cakes",
        background:"src/assets/images/bg1.jpg",
      },
      produtos: filteredProducts
    });
  }
  return res.json({
    dadosDaLoja:{
      titulo: "Sandra's Cakes",
      background:"src/assets/images/bg1.jpg",
    },
    produtos: ListaProdutos
  });
});

app.get("/produto/:id", function (req, res) {
  // console.log(JSON.parse(ListaProdutos))
  const { id } = req.params;
  let adicionais = []
  for (let adicional of ListaAdicionais){
    if(adicional.produto == id){
      adicionais.push(adicional)
    }
  }
  for (let i of ListaProdutos) {
      for(let p of i.produtos){
          if(p.id == id ){
              return res.json({...p, adicionais})
          }
      }
  }
  return res.json([]);
});

app.post("/novo-pedido", function(req, res){
  const { contato, entrega, formaDePagamento,pedido} = req.body;
  if(!pedido){
    return res.status(400).json({err: "Nenhum pedido!"})
  }
  if(!entrega){
    return res.status(400).json({err: "campo entrega em branco!"})
  }
  if(!formaDePagamento){
    return res.status(400).json({err: "campo forma de pagamento em branco!"})
  }
  if(!contato){
    return res.status(400).json({err: "Nenhum contato!"})
  }
  if(pedido.length === 0 ){
    return res.status(400).json({err: "Nenhum pedido!"})
  }
  if(!contato.nome ){
    return res.status(400).json({err: "Nome do cliente não encontrado!"})
  }
  if(!contato.telefone){
    return res.status(400).json({err: "Telefone não encontrado"})
  }



  return res.status(200).json({contato, entrega,formaDePagamento, pedido})
})


app.listen(process.env.PORT || 3000);
