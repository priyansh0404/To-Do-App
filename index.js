import express from 'express';
const app = express();
app.get("/",(req,resp)=>{
    resp.send("Hii");
})
app.listen(3000);