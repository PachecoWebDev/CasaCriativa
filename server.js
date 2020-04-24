const express = require("express");
const server = express();
const methodOverride = require("method-override");

const db = require("./db");

/*const ideas = [
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
        title: "Cursos de Programação",
        category: "Estudos",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet magnam nulla eius vitae temporibus repellendus voluptas dolore",
        url: "http://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
        title: "Exercícios",
        category: "Saúde",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet magnam nulla eius vitae temporibus repellendus voluptas dolore",
        url: "http://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
        title: "Meditação",
        category: "Mentalidade",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet magnam nulla eius vitae temporibus repellendus voluptas dolore",
        url: "http://rocketseat.com.br"
    },
    {
        img: "https://image.flaticon.com/icons/svg/2729/2729032.svg",
        title: "Karaokê",
        category: "Diversão em Família",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet magnam nulla eius vitae temporibus repellendus voluptas dolore",
        url: "http://rocketseat.com.br"
    },
]*/

//Configurando arquivos estáticos
server.use(express.static("public"));

//habiliatr uso do req.body
server.use(express.urlencoded({ extended:true}));

//habilitando a sobreposição de métodos
server.use(methodOverride('_method'));

//Configurando o Nunjucks
const nunjucks = require("nunjucks");

nunjucks.configure("views", {
    express: server,
    noCache: true
});

server.get("/", function(req, res){

    db.all('SELECT * FROM ideas', function(err, rows){
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados");
        };

        const reversedIdeas = [...rows].reverse();
        let lastIdeas = [];
        for (idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }
        
        return res.render("index.html", {ideas: lastIdeas});
    });
});

server.get("/ideias", function(req, res){

    db.all('SELECT * FROM ideas', function(err, rows){
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados");
        };

        const reversedIdeas = [...rows].reverse();

        return res.render("ideias.html", {ideas: reversedIdeas});
    });
});

server.post("/", function(req, res){
    //Inserir dados na tabela
    const query = `
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES (?,?,?,?,?);
    `;

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    db.run(query, values, function(err){
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados");
        };

        return res.redirect('/ideias');
    });
});

server.get("/delete/:id", function(req, res){
    db.run("DELETE FROM ideas WHERE id = ?", [req.params.id], function(err){
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados");
        };
        
        return res.redirect('/ideias');
    })
});

server.delete("/delete/:id", function(req, res){
    db.run("DELETE FROM ideas WHERE id = ?", [req.params.id], function(err){
        if (err) {
            console.log(err);
            return res.send("Erro no banco de dados");
        };
        
        return res.redirect('/ideias');
    })
});

server.listen(3000);