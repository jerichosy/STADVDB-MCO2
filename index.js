const dotenv = require(`dotenv`);
const express = require(`express`);
const hbs = require(`hbs`);
const bodyParser = require(`body-parser`);
const routes = require(`./routes/routes.js`);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set(`view engine`, `hbs`);
hbs.registerPartials(__dirname + `/views/partials`);
hbs.registerHelper("ifEqual", function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
});

dotenv.config();
hostname = process.env.HOSTNAME;
port = process.env.PORT;

app.use(express.static(`public`));
app.use(`/`, routes);

//db.connect();

app.listen(port, hostname, function () {
    console.log(`Server ${process.env.NODE_NO} is running at:`);
    console.log(`http://` + hostname + `:` + port);
});
