const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8081;
const request = require('request');

const download = (url, dest, cb) => {
    const file = fs.createWriteStream(dest);
    const sendReq = request.get(url);
    
    // verify response code
    sendReq.on('response', (response) => {
        if (response.statusCode !== 200) {
            return cb(1);
        }else{
          return cb(0);
        }

        sendReq.pipe(file);
    });

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb));

    // check for request errors
    sendReq.on('error', (err) => {
        fs.unlink(dest, () => cb(err.message)); // delete the (partial) file and then return the error
    });

    file.on('error', (err) => { // Handle errors
        fs.unlink(dest, () => cb(err.message)); // delete the (partial) file and then return the error
    });
};

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
    x=await download(url,path);
    res.send(x);
  } catch (error) {
    res.status(400).send('Err');
  }
})

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
