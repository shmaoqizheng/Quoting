var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/static"));

mongoose.connect('mongodb://localhost/QuotingDojo');

var QuoteSchema = new mongoose.Schema({
    name: {type: String, required: [true, "error"]}
    quote: String
}, {timestamps: true });
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');
mongoose.Promise = global.Promise;

app.get("/", function(request, response) {
    response.render('index');
});

app.get("/quotes", function(request, response) {
    Quote.find({}, function(err, result) {
        if (err) {
            console.log("something went wrong");
            response.redirect('/');
        } else {
            response.render('quotes', {quotes: result});
        }
    });
});

app.post("/process", function(request, response) {
    var quote = new Quote({
        name: request.body.name,
        quote: request.body.quote
    });
    quote.save(function(err, result) {
        if (err) {
            console.log("something went wrong");
            response.redirect('/');
        } else {
            response.redirect('/quotes');
        }
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})
