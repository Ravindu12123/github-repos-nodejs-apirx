const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8081;
const fs= require('fs');


app.get('/file', async (req, res) => {
  const u = req.query.n;
  try {
    res.sendFile(__dirname + `/files/${u}`);

    //res.send(repos);
  } catch (error) {
    res.status(400).send('Error while getting file');
  }
});

app.get('/download',async (req,res) => {
  const url=req.query.url;
  try{
  const na=url.split('/');
  const path='/files/'+na[na.length-2];
 consolelog(path);
axios.get(url, {responseType: "stream"} )  
.then(response => {  
// Saving file to working directory  
    response.data.pipe(fs.createWriteStream(path));  
    res.send(path);
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
