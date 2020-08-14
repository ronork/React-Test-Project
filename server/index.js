const cors = require('cors')
const compression = require('compression')
const express = require('express');
const path = require('path');

const app = express();
app.use(cors())
app.use(compression());
const port = 8080;


app.use(express.static(path.resolve(__dirname, '..', 'build')));//serve build chunks


app.all('*', (req, res) => res.send(`
<html>

<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reddit Posts</title>
</head>

<body>
    <div id="reactDiv"></div>
    <script src="/bundle.js"></script>
</body>

</html>
`))




app.listen(port, () => console.log(`App Started at  http://localhost:${port}`))

