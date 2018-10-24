const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// set static folder
app.use(express.static(`${__dirname}/public`));

// index route
app.get('/', (req, res) => {
    res.render('index', {
        stripePubKey: keys.stripePubKey
    });
});

// charge route
app.post('/charge', async (req, res) => {
    const amount = 7000;
    console.log(req.body);

    const {stripeEmail, stripeToken, stripeTokenType} = req.body;

    const customer = await stripe.customers.create(
        {
            email: stripeEmail,
            source: stripeToken,
        }
    );

    await stripe.charges.create({
        amount,
        description: 'Buy ticket to "event name"',
        currency: 'usd',
        customer: customer.id
    })

    res.render('success');
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
});