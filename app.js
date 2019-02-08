const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.render('index', {
        stripePubKey: keys.stripePubKey // прокидываем ключ во вьюху
    });
});

app.get('/success', (req, res) => {
    res.render('success');
});

app.post('/3dcharge', async(req,res) => {
    const {
        source // забираем source id
    } = req.body;


    await stripe.charges.create({ // отправляем данные в stripe
        amount: 2500,
        description: '3d secure payment',
        currency: 'eur',
        source
    })

    res.render('success');
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
});