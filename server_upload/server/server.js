var express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

var app = express();
var port = process.env.PORT || 4000;

// enable CORS
app.use(cors());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// serving static files
app.use('/data_storage', express.static('data_storage'));

// handle storage using multer
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'data_storage');
	},
	filename: function (req, file, cb) {
		cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
	}
});
var upload = multer({ storage: storage });

// handle single file upload
app.post('/file/uploadfile', upload.single('file'), (req, res, next) => {
	const file = req.file;
	if (!file) {
		return res.status(400).send({ message: 'Please upload a file.' });
	}
	return res.send({ message: 'File uploaded successfully.', file });
});

// handle multiple file upload
// app.post('/uploadmultifile', upload.array('dataFiles', 10), (req, res, next) => {
// 	const files = req.files;
// 	if (!files || (files && files.length === 0)) {
// 		return res.status(400).send({ message: 'Please upload a file.' });
// 	}
// 	return res.send({ message: 'File uploaded successfully.', files });
// });

app.listen(port, () => {
	console.log('Server started on: ' + port);
});
