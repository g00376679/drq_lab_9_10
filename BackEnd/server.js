// Server Setup local host 4000 
const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//to avoid cors error 
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//set up configuration these will tell where to find important files
app.use(express.static(path.join(__dirname,'../build')));
app.use('/static', express.static(path.join(__dirname, 'build//static')));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//Connection added with mongoDb
const myConnectionString = 'mongodb+srv://admin:Mongodb?@cluster0.xvk7v.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(myConnectionString, { useNewUrlParser: true });

const Schema = mongoose.Schema;
const movieSchema = new Schema({
    Title:String,
    Year:String,
    Poster:String
})
//create model for database
const movieModel = mongoose.model('movies', movieSchema);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/movies', (req, res) => {
    
    movieModel.find((err,data)=>{
        res.json(data);
    })
    //         "Poster": "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg"
    //         "Poster": "https://m.media-amazon.com/images/M/MV5BMjQ0MTgyNjAxMV5BMl5BanBnXkFtZTgwNjUzMDkyODE@._V1_SX300.jpg"
    
})

app.get('/api/movies/:id',(req, res)=>{

    console.log(req.params.id);

    movieModel.findById(req.params.id, (err,data)=>{
        res.json(data);
    })
})
//delete method 
app.delete('/api/movies/:id', (req, res)=>{
    console.log(req.params.id);

    movieModel.findByIdAndDelete({_id:req.params.id},
         (err, data)=>{
        res.send(data);
    })
})


app.post('/api/movies', (req, res) => {
    console.log(req.body);

    movieModel.create({
        Title:req.body.Title,
        Year:req.body.Year,
        Poster:req.body.Poster
    })
    .then()
    .catch();

    res.send('Data Recieved!');
})
//this method will return html front end file 
app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname+'/../build/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})