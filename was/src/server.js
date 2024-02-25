import http from "http";
import https from "https";

import WebSocket from "ws";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const isBot = require('./dRepo/isBot');


const router = express.Router(); // subcontext 정의를 위함


const d_Conf = {
  // @ Protocol
  "protocol" : "http",
  // @ domain
  "domain" : "doiloppa.chickenkiller.com",
  // @ http port
  "port" : 13939,
  // @ outter port
  "oPort" : 80,
  // @ https port (secure)
  "ssl_Port" : 443,
  // @ 해당 app의 context path
  "context_root" : "node"
};


const d_Server = express();

d_Server.use(`/${d_Conf.context_root}`, router);

/**
 * [view,static resources] set-up
 */


d_Server.set('view engine', "pug");
d_Server.set("views",__dirname + "/views");
d_Server.set('view cache', false);
router.use('/module' , express.static(__dirname + "/Public/dModules"));
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

/**

                                                                                                                 
8 888888888o.       ,o888888o.     8 8888      88 8888888 8888888888  8 8888 b.             8      ,o888888o.    
8 8888    `88.   . 8888     `88.   8 8888      88       8 8888        8 8888 888o.          8     8888     `88.  
8 8888     `88  ,8 8888       `8b  8 8888      88       8 8888        8 8888 Y88888o.       8  ,8 8888       `8. 
8 8888     ,88  88 8888        `8b 8 8888      88       8 8888        8 8888 .`Y888888o.    8  88 8888           
8 8888.   ,88'  88 8888         88 8 8888      88       8 8888        8 8888 8o. `Y888888o. 8  88 8888           
8 888888888P'   88 8888         88 8 8888      88       8 8888        8 8888 8`Y8o. `Y88888o8  88 8888           
8 8888`8b       88 8888        ,8P 8 8888      88       8 8888        8 8888 8   `Y8o. `Y8888  88 8888   8888888 
8 8888 `8b.     `8 8888       ,8P  ` 8888     ,8P       8 8888        8 8888 8      `Y8o. `Y8  `8 8888       .8' 
8 8888   `8b.    ` 8888     ,88'     8888   ,d8P        8 8888        8 8888 8         `Y8o.`     8888     ,88'  
8 8888     `88.     `8888888P'        `Y88888P'         8 8888        8 8888 8            `Yo      `8888888P'    



                                                                                                               
   d888888o.   8 8888888888       ,o888888o.    8888888 8888888888  8 8888     ,o888888o.     b.             8 
 .`8888:' `88. 8 8888            8888     `88.        8 8888        8 8888  . 8888     `88.   888o.          8 
 8.`8888.   Y8 8 8888         ,8 8888       `8.       8 8888        8 8888 ,8 8888       `8b  Y88888o.       8 
 `8.`8888.     8 8888         88 8888                 8 8888        8 8888 88 8888        `8b .`Y888888o.    8 
  `8.`8888.    8 888888888888 88 8888                 8 8888        8 8888 88 8888         88 8o. `Y888888o. 8 
   `8.`8888.   8 8888         88 8888                 8 8888        8 8888 88 8888         88 8`Y8o. `Y88888o8 
    `8.`8888.  8 8888         88 8888                 8 8888        8 8888 88 8888        ,8P 8   `Y8o. `Y8888 
8b   `8.`8888. 8 8888         `8 8888       .8'       8 8888        8 8888 `8 8888       ,8P  8      `Y8o. `Y8 
`8b.  ;8.`8888 8 8888            8888     ,88'        8 8888        8 8888  ` 8888     ,88'   8         `Y8o.` 
 `Y8888P ,88P' 8 888888888888     `8888888P'          8 8888        8 8888     `8888888P'     8            `Yo 

 

 */

 router.get(`/`, (req,res)=>{
  res.render("index");
});

router.get(`/fragmentScroll.test`, (req,res)=>{
  res.render("dModules/fragmentScroll/fragmentScroll");
});

router.get(`/fingerPrint.test`, (req,res)=>{
  res.render("dModules/fingerPrint/fingerPrint");
});

router.get(`/macroProtect.test`, (req,res)=>{
  res.render("dModules/macroProtect/macroMain");
});
/*
const isBot = (req) => {
  const userAgent = req.headers['user-agent'];
  return /bot|crawler|spider|googlebot|facebookbot|slurp|bingbot|yandex|yeti/i.test(userAgent);
};
*/
router.post("/macroTest.test" , (req,res)=>{
  //console.log(req.headers);
  const cookieHash = JSON.parse(req.cookies.fingerPrint);
  console.log(cookieHash.hashId);

  if(!cookieHash.hashId) {
    res.status(400).send("Can't identify the fingerprint");
    return;
  }
  
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const botChk = isBot(req.headers['user-agent']) ? "bot" : "user";

  console.log(`user-agent : ${req.headers["user-agent"]}`);
  console.log(`referer : ${req.headers["referer"]}`);
  console.log(`client-ip : ${ipAddress}`);
  console.log(`client is : ${botChk}`);
  
  const getDatas = req.body;
  console.log(req.body);
  // console.log(`headers: ${JSON.stringify(req.headers, null, 2)}`);

  res.render("dModules/macroProtect/macroTest", { 
    "title" : "Macro Test",
    "botChk" : botChk, 
    "ipAddress" : ipAddress,
    "user_agent" : req.headers["user-agent"],
    "referer" : req.headers["referer"],
    "params" : JSON.stringify(getDatas)
  });

});


// catchall
router.get("/*", (req,res) => res.redirect("/"));

////////////////////* routing section end */

// listen handler
const handleListen = () =>{

  const timeOption = {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day:"numeric",
    hour:"numeric",
    minute:"numeric",
    second:"numeric",
  };

  const startTime = new Date();
  switch(d_Conf["protocol"]){
    case "https":
      break;
    case "http":
      console.log(`
      ##########################################################
        [started at : ${startTime.toLocaleDateString("ko-kr", timeOption)}]
        😎 Wellcome to DOIL's dev SERVER (by express) 😎
        🐳 Server listening on local port ${d_Conf.port}
        site : http://${d_Conf.domain}:${d_Conf.oPort}/${d_Conf.context_root}/
      ##########################################################
      `);
      default:
        break;
  }
}


d_Server.listen(d_Conf["port"] , "0.0.0.0", handleListen);
