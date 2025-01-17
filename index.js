const { File } = require('megajs');
const m3u8tomp4 = require('@zackdk/m3u8tomp4');
const express = require('express');
const axios = require('axios');
const path=require('path');
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
    res.sendFile(path.join(__dirname,u));

    //res.send(repos);
  } catch (error) {
    res.status(400).send('Error while getting file');
  }
});
app.get('/m3',async (req,res)=>{
   m3u8Url=req.query.url;
  n=req.query.n;
var data = await m3u8tomp4.default(m3u8Url);
fs.promises.writeFile(n, data).then(e=> res.send("done"));
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

const replacerFunc = () => {
    const visited = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };

app.get('/mega',async (req,res) => {
type=req.query.type;
  id=req.query.id;
  key=req.query.key;
url=`https://mega.nz/${type}/${id}#${key}`;
  const file = File.fromURL(url)

  await file.loadAttributes()

  res.send(JSON.stringify(file,replacerFunc()));
  /*const data = await file.downloadBuffer()
  console.log(data.toString()) // file contents*/
  
});
app.get('/megad',async (req,res) => {
  type=req.query.type;
  id=req.query.id;
  key=req.query.key;
  f=req.query.f;
url=`https://mega.nz/${type}/${id}#${key}/file/${f}`;
  const folder = File.fromURL(url)
// Load folder attributes
folder.loadAttributes((error, file) => {
  if (error) return console.error(error)

  // Will download a file specified by /file/example in the URL
  file.download((error, data) => {
    if (error) return console.error(error)
    console.log(data)
  })
  res.send(file.name);
})
});
  
app.get('/download',async (req,res) => {
  const url=req.query.url;
  try{
  const na=url.split('/');
  const patth=__dirname+'/files/'+na[na.length-1];
 console.log(path);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const agent = new https.Agent({  
  rejectUnauthorized: false
});
//axios.get('https://something.com/foo', { httpsAgent: agent });

    
axios.get(url, {responseType: "stream",httpsAgent: agent} ).then(response => {  
// Saving file to working directory  
    response.data.pipe(cv=fs.createWriteStream(patth)); 
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
