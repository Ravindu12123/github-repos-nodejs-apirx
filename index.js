const express = require('express');
const axios = require('axios');
var app = express();
const PORT = process.env.PORT || 8081;
const fs= require('fs');
const dir = './files'; // create new directory
try {     // check if directory already exists    
  if (!fs.existsSync(dir)) {         fs.mkdirSync(dir);         console.log("Directory is created.");     } else {         console.log("Directory already exists.");     } } catch (err) {     console.log(err); }
//app.use(express.static(__dirname + '/public'));
app.use('/files', express.static(__dirname + '/files'));

app.get('/file', async (req, res) => {
  const u = req.query.n;
  try {
    res.sendFile(__dirname + `/${u}`);

    //res.send(repos);
  } catch (error) {
    res.status(400).send('Error while getting file');
  }
});
app.get('/',async (req,res) => {
  url=req.query.url;
  axios.get(url,{responseType:"stream"}).then(resp =>{
    resp.pipe(res);
  }).catch(er=>{
    res.send(er);
  });
});
app.get('/filesd',async (req,res) => {
  var r={};
fs.readdirSync(__dirname+'/files/').forEach((file,i)=> {
  console.log(file);
  r[i]=file;
});
  res.send(JSON.stringify(r));
});
app.get('/download',async (req,res) => {
  const url=req.query.url;
  try{
  const na=url.split('/');
  const path=__dirname+'/public/'+na[na.length-1];
 console.log(path);
axios.get(url, {responseType: "stream"} )  
.then(response => {  
// Saving file to working directory  
    response.data.pipe(cv=fs.createWriteStream(path));  
    cv.end();
    res.send(path+JSON.stringify(cv));
})  
    .catch(error => {  
    console.log(error);  
        res.send('err');
});  
  } catch (error) {
    res.status(400).send('Err');
  }
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
