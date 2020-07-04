 /**
 * Copyright 2020 Nemanja Vukmirovic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function(RED) {
    function listen(config) {

        const { spawn } = require("child_process");
        RED.nodes.createNode(this,config);
        var node = this;
        var baudmode = config.baudmode;
        var autocarrier = config.autocarrier;
        var inverted = config.inverted;
        var confidence = config.confidence;
        var limit = config.limit;
        var bandwith = config.bandwith;
        var mark = config.mark;
        var space = config.space;
        var startbits = config.startbits;
        var stopbits = config.stopbits;
        var invertstartstop = config.invertstartstop;
        var syncbyte = config.syncbyte;
        var quiet = config.quiet;
        var floatsamples = config.floatsamples
        var sendletternum = config.sendletternum;
        var timeoutval = config.timeoutvalue;
    
          //Declare values 
          var buffer
          var confidenceval = config.confidenceval;
          var limitval = config.limitval;
          var bandwithval = config.bandwithval;
          var markval = config.markval;
          var spaceval = config.spaceval;
          var startbitsval = config.startbitsval;
          var stopbitsval = config.stopbitsval;
          var syncbyteval = config.syncbyteval;
          var endchar = config.endchar;
          var recmsg;
       
          // Other values
        
          var receivedlenght;
          var receivedmatch = false;
            this.on('close', function() {
                ls.kill()
            });
            function sleep (time) { return new Promise((resolve) => setTimeout(resolve, time));}
        function checkifinstalled(){
            exec('minimodem -V',(error, stdout, stderr) =>{
                if (error) {
                    console.log("\x1b[31m",`error: ${error.message}`);
                    console.log(`Please install minimodem from your package manager!`);
                    node.status({fill:"red", shape:"dot", text:"Please install minimodem from your package manager!"})
                    console.log( "\x1b[0m")
                    installed = false   
                    done()
                    return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log("\x1b[34m",'Minimodem installed! :) ')
            console.log( "\x1b[0m")
            node.status({fill:"green", shape:"dot", text:"Ready!"})
            installed = true
           
            } )
        }
        function formatexecutecmd(){
            var output = new Array()
            if (autocarrier){output.push ('--auto-carrier')}
            if (inverted){output.push ('--inverted')}          var messagetype = config.messagetype;
            if (bandwith){output.push ( '--bandwidth ' + bandwithval + '')}
            if (mark){output.push ('--mark ' + markval + '')}
            if (quiet){output.push ('--quiet')}
            if (space){output.push ( '--space ' + spaceval )}
            if (startbits){output.push ( '--startbits ' + startbitsval + '')}
            if (stopbits){output.push ( '--stopbits ' + stopbitsval + '')}
            if (invertstartstop){output.push ('--invert-start-stop ')}
            if (syncbyte){output.push ('--sync-byte ' + syncbyteval + '')}
            if (confidence){output.push ('--confidence ' + confidenceval + '')}
            if (limit){output.push ('--limit ' + limitval + '')}
            if (floatsamples){output.push ('--float-samples')}
            
            
            output.push(baudmode)
            return output;
        }
        var cmd = formatexecutecmd()
        
        
        getlisten(cmd)
       
        let timeout = false;
        let outputBufferArr = [];

    
       
        function getlisten(){
            var i = 0
            var recmsg 
            const ls = spawn("minimodem" , cmd  );
            node.status({fill:"blue", shape:"dot", text:"Listening!"})
            ls.stdout.on("data", data => {
                recmsg = data
                timeoutConcat(recmsg)
                
                
            });
            ls.on('error', (error) => {
                console.log(`error: ${error.message}`);
            });
            
            ls.on("close", code => {
                console.log(`child process exited with code ${code}`);
            });
        }
        function timeoutConcat(data){
            if(timeout) {
                clearTimeout(timeout);
                   timeout = false; }
            outputBufferArr.push(data);
           timeout = setTimeout(()=>{
               const message = Buffer.concat(outputBufferArr);
              
               checkifcorrect(message)
               outputBufferArr = [];
           }, parseInt(timeoutval))}

        function checkifcorrect(message){
            var mesg
            var entiremsg 
            var str = message.toString()
            if (str.includes(endchar)){
                entiremsg=true
            }
            else {
                entiremsg = false
            }
            regex = new RegExp(
                "([\\x7F-\\x84]|[\\x86-\\x9F]|[\\uFDD0-\\uFDEF]|(?:\\uD83F[\\uDFFE\\uDFFF])|(?:\\uD87F[\\uDF"+
                "FE\\uDFFF])|(?:\\uD8BF[\\uDFFE\\uDFFF])|(?:\\uD8FF[\\uDFFE\\uDFFF])|(?:\\uD93F[\\uDFFE\\uD"+
                "FFF])|(?:\\uD97F[\\uDFFE\\uDFFF])|(?:\\uD9BF[\\uDFFE\\uDFFF])|(?:\\uD9FF[\\uDFFE\\uDFFF])"+
                "|(?:\\uDA3F[\\uDFFE\\uDFFF])|(?:\\uDA7F[\\uDFFE\\uDFFF])|(?:\\uDABF[\\uDFFE\\uDFFF])|(?:\\"+
                "uDAFF[\\uDFFE\\uDFFF])|(?:\\uDB3F[\\uDFFE\\uDFFF])|(?:\\uDB7F[\\uDFFE\\uDFFF])|(?:\\uDBBF"+
                "[\\uDFFE\\uDFFF])|(?:\\uDBFF[\\uDFFE\\uDFFF])(?:[\\0-\\t\\x0B\\f\\x0E-\\u2027\\u202A-\\uD7FF\\"+
                "uE000-\\uFFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF]|[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|"+
                "(?:[^\\uD800-\\uDBFF]|^)[\\uDC00-\\uDFFF]))", "g");
            mesg = str.replace(endchar,'')
            mesg = mesg.replace(regex,'')
            str = mesg
            
            if (sendletternum){
            

            
            
            var reccharnum = str.substring(
                str.lastIndexOf('[') + 1, 
                str.lastIndexOf(']')
                
                );
                str = str.split('[')
             mesg = str[0]
            if (mesg.length  == parseInt(reccharnum)){
                receivedmatch = true
               receivedlenght = mesg.length
               msgoutput(mesg)
            }
            else {
                receivedmatch = false
                receivedlenght =mesg.length
                msgoutput(mesg)
            }

        }
        else {

            msgoutput(mesg)
        }
   
        
    }
    function msgoutput(omsg){
        if (receivedmatch){
        msg = {
            payload : omsg,
            minimodem : {
            receivedmatch: receivedmatch,
            receivedlenght: receivedlenght,
            time: Math.floor(new Date() ) ,
            options:{
                autocarrier: autocarrier,
                inverted: inverted,
                bandwidth: bandwith,
                mark:{
                    mark: mark,
                    markvalue: markval,
                },
                space:{
                    space: space,
                    spacevalue: spaceval
                },
                startbits:{
                    startbits: startbits,
                    startbitsvalue: startbitsval,
                },
                stopbits: {
                    stopbits: stopbits,
                    stopbitsvalue: stopbitsval,
                },
                invertstartstop: invertstartstop,
                quiet: quiet,
                syncbyte: {
                    syncbyte:syncbyte,
                    syncbytevalue: syncbyteval,
                },
                confidence:{
                    confidence:confidence,
                    confidencevalue: confidenceval,
                },
                limit:{
                    limit:limit,
                    limitvalue: limitval,
                },
                floatsamples:floatsamples,
            },
            
            
            }}
        }
        else {
            msg = {
                payload : omsg,
                minimodem : {
                time: Math.floor(new Date() ) ,
                options:{
                    autocarrier: autocarrier,
                    inverted: inverted,
                    bandwidth: bandwith,
                    mark:{
                        mark: mark,
                        markvalue: markval,
                    },
                    space:{
                        space: space,
                        spacevalue: spaceval
                    },
                    startbits:{
                        startbits: startbits,
                        startbitsvalue: startbitsval,
                    },
                    stopbits: {
                        stopbits: stopbits,
                        stopbitsvalue: stopbitsval,
                    },
                    invertstartstop: invertstartstop,
                    quiet: quiet,
                    syncbyte: {
                        syncbyte:syncbyte,
                        syncbytevalue: syncbyteval,
                    },
                    confidence:{
                        confidence:confidence,
                        confidencevalue: confidenceval,
                    },
                    limit:{
                        limit:limit,
                        limitvalue: limitval,
                    },
                    floatsamples:floatsamples,
                },
                
                }}
        }
        node.send(msg);
        node.status({fill:"green",shape:"ring",text:"Received" });
            sleep(5000)
            node.status({fill:"blue",shape:"dot",text:"Listening!" });
    }
        
        
    }

    RED.nodes.registerType("listen",listen);

}
