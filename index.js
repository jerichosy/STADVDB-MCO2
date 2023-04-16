const dotenv = require(`dotenv`);
const express = require(`express`);
const hbs = require(`hbs`);
const bodyParser = require(`body-parser`);
const routes = require(`./routes/routes.js`);
const replicator = require(`./models/replicator.js`);
const sync = require(`./models/synchronizer.js`);
const { node1, node2, node3, node_utils } = require('./models/nodes.js');

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
hostname = process.env.THIS_HOST;
port = process.env.PORT;

app.use(express.static(`public`));
app.use(`/`, routes);

switch (process.env.NODE_NO) {
    case `1`:
        replicator(sync.sync_central);
        break;
    case `2`:
        replicator(sync.sync_fragment, node2, 2);
        break;
    case `3`:
        replicator(sync.sync_fragment, node3, 3);
        break;
}

app.listen(port, hostname, function () {
    console.log(`Server ${process.env.NODE_NO} is running at:`);
    console.log(`http://` + hostname + `:` + port);
});