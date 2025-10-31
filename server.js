const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors'); // add this
const corsOptions = { // also this
  origin: ['http://localhost:4200', 'https://myexpressoct2025-production-8e0b.up.railway.app','https://mymahirangular2025.web.app'], // Allowed origins. Kena sama dengan frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  credentials: true, // Allow sending cookies/authorization headers
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed request headers
};
app.use(cors(corsOptions));

app.engine( 'ejs', require( 'ejs' ).__express);
app.set( 'view engine', 'ejs' );
app.set( 'views', path.join( __dirname, 'views' ));

app.use(express.static('public'));

// Middleware For Parsing JSON and Form Data
app.use( express.json() );
app.use( express.urlencoded({ extended: true }));

//slide 97. update
const methodOverride = require( 'method-override' );
app.use( methodOverride( '_method' ));

app.get('/', (req, res) => {
  res.send('Hello Express!');
});

app.get('/about', (req,res) =>{
    res.send('About us page');
});

app.get('/search', (req,res) =>{
    const {q, page} = req.query;
    res.send( `Search: ${  q ||'no keyword'}. ( page ${ page || 1 })` );
});

const blogRoutes = require( './routes/blogRoutes' );
app.use( '/posts', blogRoutes ); //sini kena guna post: why?

const posting = [
    {id: 1, title: 'Hello Express'},
    {id: 2, title: 'Tips Express JS'}
]

app.get('/posting', (req,res) =>{
    res.render('index', {title: 'My Posting', posting})
});


//slide 55. First create the routing function then do the HTML
app.get('/posting/:id', (req,res)=>{
    const post = posting.find(p=>p.id == Number(req.params.id));
    if(!post) return res.status(404).send('Post not found');
    res.render('post', {post});
});

const contactRoutes = require( './routes/contact/contact_route' );
app.use( '/contacts', contactRoutes );

const studentRoutes = require ('./routes/students/student_route');
app.use('/students', studentRoutes);

const apiRoutes = require ('./routes/api/studentapi_routes');
app.use('/api/students', apiRoutes);

const authRoutes = require ('./routes/api/authapi_routes');
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


