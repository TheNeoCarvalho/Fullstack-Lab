const express = require('express')

const app = express()
const axios = require('axios')
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded())

const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
    const content = await axios.get('https://como-fazer-manolo.firebaseio.com/Teste.json')
    res.render('index', { valor : content.data} )
}) 

app.get('/categoria/novo', (req, res) => {
    res.render('categoria/novo')
})

app.post('/categoria/novo', async (req, res) => {
    await axios.post('https://como-fazer-manolo.firebaseio.com/Categoria.json',
        { 
            categoria : req.body.categoria 
        })
    res.redirect('/categoria')
})

app.get('/categoria', async (req, res)=> {
    const content = await axios.get('https://como-fazer-manolo.firebaseio.com/Categoria.json')
    
    if(content.data){
        const categorias = Object
                            .keys(content.data)
                            .map(key => {
                                return {
                                    id: key,
                                    ...content.data[key]
                                }
                            })
        res.render('categoria/index', { categorias: categorias })
    }else {
        res.render('categoria/index', { categorias: [] })
    }
})

app.get('/categoria/excluir/:id', async(req, res) => {
    await axios.delete(`https://como-fazer-manolo.firebaseio.com/Categoria/${req.params.id}.json`)
    res.redirect('/categoria')
})

app.get('/categoria/editar/:id', async(req, res) => {
    const content = axios.get(`https://como-fazer-manolo.firebaseio.com/Categoria/${req.params.id}.json`)
    res.render('categoria/editar', 
        {
         id: req.params.id,
         ...content.data
        }
    )
})

app.post('/categoria/editar/:id', async(req, res) => {
    await axios.put(`https://como-fazer-manolo.firebaseio.com/Categoria/${req.params.id}.json`,
    {
        categoria: req.body.categoria
    })
    res.redirect('/categoria')
})

app.listen(port , (err) => {
    if(err){
        console.log('Erro!');
    }else{
        console.log('App listening on port '+ port);
    }
});