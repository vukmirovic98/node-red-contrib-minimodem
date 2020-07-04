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
    function send(config) {
       
        const { exec } = require("child_process");
      
        RED.nodes.createNode(this,config);
        var node = this;
        var options;
        var baudmode = config.baudmode;
        var autocarrier = config.autocarrier;
        var inverted = config.inverted;
        var bandwith = config.bandwith;
        var mark = config.mark;
        var space =config.space;
        var startbits = config.startbits;
        var stopbits = config.stopbits;
        var invertstartstop = config.invertstartstop;
        var syncbyte = config.syncbyte;
        var quiet = config.quiet;
        var samplerate = config.samplerate;
        var floatsamples= config.floatsamples;

        var bandwithval = config.bandwithval;
        var markval = config.markval;
        var spaceval = config.spaceval;
        var startbitsval = config.startbitsval;
        var stopbitsval = config.stopbitsval;
        var syncbyteval = config.syncbyteval;
        var samplerateval = config.samplerateval;
        var endchar = config.endchar;
        var sendletternum = config.sendletternum;
        var repeat = config.repeat;
        var repeatdelay = config.repeatdelay;
        var repeatxtimes = config.repeatxtimes;
        var installed =false
        var repeatdelaytoint  = parseInt(repeatdelay);
        var repeatxtimestoint = parseInt(repeatxtimes);
        var pause = false
        var globalerror = false
        checkifinstalled()
        function checkifinstalled(){
            exec('minimodem -V',(error, stdout, stderr) =>{
                if (error) {
                    console.log("\x1b[31m",`error: ${error.message}`);
                    console.log(`Please install minimodem from your package manager!`);
                    node.status({fill:"red", shape:"dot", text:"Please install minimodem from your package manager!"})
                    console.log( "\x1b[0m")
                    installed = false  
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
        this.on('close', function() {
            pause = false
         });
        node.on('input', function(msg, send, done) { 
            var sendstring = msg.payload
            globalerror = false
            pause = false
             repeatdelaytoint  = parseInt(repeatdelay);
         repeatxtimestoint = parseInt(repeatxtimes);
            node.status({fill:"blue", shape:"dot", text:"Sending..."})
            if (installed){
                overwrite()
                if (typeof(bandwithval) != "undefined" || typeof(markval) != "undefined" || typeof(spaceval) != "undefined" || typeof(startbitsval) != "undefined" || typeof(stopbitsval) != "undefined" || typeof(syncbyteval) != "undefined" || typeof(samplerateval) != "undefined" );
                {
                    
                      options = formatexecutecmd()  
                      pause = false
                      if (globalerror != true){
                      checkrepeat()
                    }
                    else { node.status({fill:"red", shape:"dot", text:"Error!"})
                }
                    
                }
                
 
            }
            
            else if(!installed){
                node.error('Minimodem is not installed!')
                node.error('Please install minimodem from your package manager!')
                globalerror = true
                
            }
                function overwrite(){
                    if (typeof msg.baudmode == 'number' ){
                        baudmode = msg.baudmode
                    }else if (typeof msg.baudmode != 'number' &&  typeof msg.baudmode != 'undefined'
                    ){node.error('msg.baudmode is not a number!')
                    globalerror = true
                    

                    if (typeof msg.autocarrier == 'boolean' ){
                        autocarrier = msg.autocarrier
                    }else if (typeof msg.autocarrier != 'boolean' && typeof msg.autocarrier != 'undefined'
                    ){node.error('msg.autocarrier is not a boolean!')
                    globalerror = true
                    }

                    if (typeof msg.inverted == 'boolean' ){
                        inverted = msg.inverted
                    }else if (typeof msg.inverted != 'boolean'  && typeof msg.inverted != 'undefined'
                    ){node.error('msg.inverted is not a boolean!')
                    globalerror = true
                    }

                    if (typeof msg.bandwithval == 'number' ){
                        bandwithval = msg.bandwithval
                    }else if (typeof msg.bandwithval != 'number' && typeof msg.bandwithval != 'undefined'
                    ){node.error('msg.bandwithval is not a number!')
                    globalerror = true
                    }

                    if (typeof msg.markval == 'number' ){
                        markval = msg.markval
                    }else if (typeof msg.markval != 'number'  && typeof msg.markval != 'undefined'
                    ){node.error('msg.markval is not a number!')
                    globalerror = true

                    }

                    if (typeof msg.spaceval == 'number' ){
                        spaceval = msg.spaceval
                    }else if (typeof msg.spaceval != 'number'  && typeof msg.spaceval != 'undefined'
                    ){node.error('msg.spaceval is not a number!')
                    globalerror = true

                    }

                    if (typeof msg.startbitsval == 'number' ){
                        startbitsval = msg.startbitsval
                    }else if (typeof msg.startbitsval != 'number'   && typeof msg.startbitsval != 'undefined'
                    ){node.error('msg.startbitsval is not a number!')
                    globalerror = true

                    }

                    if (typeof msg.stopbitsval == 'number' ){
                        stopbitsval = msg.stopbitsval
                    }else if (typeof msg.stopbitsval != 'number'   && typeof msg.stopbitsval != 'undefined'
                    ){node.error('msg.stopbitsval is not a number!')
                    globalerror = true

                    }

                    if (typeof msg.invertstartstop == 'boolean' ){
                        invertstartstop = msg.invertstartstop
                    }else if (typeof msg.invertstartstop != 'boolean'   && typeof msg.invertstartstop != 'undefined'
                    ){node.error('msg.invertstartstop is not a boolean!')
                    globalerror = true

                    }

                    if (typeof msg.syncbyteval == 'string' ){
                        syncbyteval = msg.syncbyteval
                    }else if (typeof msg.syncbyteval != 'number'   && typeof msg.syncbyteval != 'undefined'
                    ){node.error('msg.syncbyteval is not a number!')
                    globalerror = true

                    }

                    if (typeof msg.quiet == 'boolean' ){
                        quiet = msg.quiet
                    }else if (typeof msg.autocarrier != 'boolean'   && typeof msg.autocarrier != 'undefined'
                    ){node.error('msg.autocarrier is not a boolean!')
                    globalerror = true

                    }

                    if (typeof msg.samplerateval == 'number' ){
                        samplerateval = msg.samplerateval
                    }else if (typeof msg.autocarrier != 'number'   && typeof msg.autocarrier != 'undefined'
                    ){node.error('msg.autocarrier is not a number!')
                    globalerror = true

                    }

                    if (typeof msg.floatsamples == 'boolean' ){
                        floatsamples = msg.floatsamples
                    }else if (typeof msg.floatsamples != 'boolean'   && typeof msg.floatsamples != 'undefined'
                    ){node.error('msg.floatsamples is not a boolean!')
                    globalerror = true

                    }

                    if (typeof msg.repeatdelay == 'number' ){
                        baudmorepeatdelayde = msg.repeatdelay
                    }else if (typeof msg.repeatdelay != 'number'   && typeof msg.repeatdelay != 'undefined'
                    ){node.error('msg.repeatdelay is not a number!')
                    globalerror = true

                    }

                    if (typeof msg.repeatxtimes == 'number' ){
                        repeatxtimes = msg.repeatxtimes
                    }else if (typeof msg.repeatxtimes != 'number'   && typeof msg.repeatxtimes != 'undefined'
                    ){node.error('msg.autocarrier is not a number!') 
                    globalerror = true

                    }
                    

                }
        function formatexecutecmd(){
            var output =''
            if (autocarrier){output = output + ' --auto-carrier '}
            if (inverted){output = output + ' --inverted'}
            if (bandwith){output = output + ' --bandwidth ' + bandwithval + ' '}
            if (mark){output = output + ' --mark ' + markval + ' '}
            if (space){output = output + ' --space ' + spaceval + ' '}
            if (startbits){output = output + ' --startbits ' + startbitsval + ' '}
            if (stopbits){output = output + ' --stopbits ' + stopbitsval + ' '}
            if (invertstartstop){output = output + ' --invert-start-stop '}
            if (syncbyte){output = output + ' --sync-byte ' + syncbyteval + ' '}
            if (quiet){output = output + ' --quiet '}
            if (samplerate){output = output + ' --samplerate ' + samplerateval + ' '}
            if (floatsamples){output = output + ' --float-samples '}
            if (sendletternum){
                sendstring = sendstring.toString();
                var i = sendstring.length
                var o = endchar.length
                var p = i+o -1
                sendstring = sendstring + '[' +  String(p) + ']' + endchar
            }
            
            return output;
        }
        
        function checkrepeat(){
            if (repeat){

                repeatfun(repeatdelaytoint)


            }
            else {
                
                exec('echo "' + sendstring + '" | minimodem --tx ' + options + ' ' + baudmode, (error, stdout, stderr) => {
                    
                    if (error) {
                        console.log(`error: ${error.message}`);
                        node.error('error:'   + error.message)
                        globalerror = true

                        
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        
                        node.error('error:' + stderr)
                        globalerror = true
                        
                        return;
                    }
                    node.status({fill:"blue", shape:"dot", text:"Sent!"})
                    
                  
                });
                }
        }
        function repeatfun(time) {
            repeatxtimestoint -= 1;
            if (pause == true) {
            setTimeout(()=>{
                executesend();
            },time);
        }
        else {executesend()
            
            return;
        }
         function executesend(){
             
            pause = true
            node.status({fill:"blue", shape:"dot", text:"Sending..."})
                
                exec('echo "' + sendstring + '" | minimodem --tx ' + options + ' ' + baudmode, (error, stdout, stderr) => {

                    if (error) {
                        console.log(`error: ${error.message}`);
                        node.error(error.message)
                        
                        
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        
                    }
                    node.status({fill:"blue", shape:"dot", text:"Sent!"})
                   
                            if (repeatxtimestoint > 0) { repeatfun(repeatdelaytoint) }
                            else {}

                });
            
        }  ; 

           
        
      
    }
    }})   
    } 
    RED.nodes.registerType("send",send);
}




  