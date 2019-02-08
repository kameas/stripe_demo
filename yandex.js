const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
var YandexCheckout = require('yandex-checkout')({
    shopId: keys.yandexShopId,
    secretKey: keys.yandexSecretKey,
    debug: true
});

const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// set static folder
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.render('yandex', {
        shopId: keys.yandexShopId
    });
});

app.post('/yandex', (req, res) => {
    const {
        token
    } = req.body;

    var idempotenceKey = '02347fc4-a1f0-49db-807e-f0d67c2ed5a5';
    YandexCheckout.createPayment({
            'payment_token': token,
            'amount': {
                'value': '2.00',
                'currency': 'RUB'
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': 'http://localhost:5000'
            }
        }, idempotenceKey)
        .then(function (result) {
            console.log({
                payment: result
            });
        })
        .catch(function (err) {
            console.error(err);
        })
})
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
});