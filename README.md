# node-red-contrib-minimodem
A node red node for text (de)coding to audio.It essentialy just executes the <a href="http://www.whence.com/minimodem/" target="_blank">minimodem</a> in the background.

# Instalation

To setup the nodes to work in the node-red there are several things that needs to be setup first.
We essentialy first need minimodem to be installed via packet manager.
```
sudo apt install minimodem
```
The node was originaly developed on Manjaro, and it worked perfectly. 
So i wanted to test it on the Raspberry PI 4. 
For the RPI (Raspberry Pi OS) you would need to setup pulseaudio and set it on boot.
<a href="https://raspberrypi.stackexchange.com/questions/639/how-to-get-pulseaudio-running/44767#44767" target="_blank"> You can follow this stackexchange answer</a>
## Nodes
Listen Node - Node for receiving/listening for audio to decode to text.
Send Node - Node for converting msg.payload to audio, and playing the audio.

### Additional Functions 
Send node accept options overwrite via msg.payload
```
msg.baudmode == number
msg.autocarrier == boolean
msg.inverted== boolean
msg.bandwithval == number
msg.markval == number
msg.spaceval == number
msg.startbitsval == number
msg.stopbitsval == number
msg.invertstartstop == boolean
msg.syncbyteval == string
msg.quiet == boolean
msg.samplerateval == number
msg.floatsample== boolean
```

#### Repeat
Send node also haves a repeat function , it can be triggered via send node options or by passing some msg values via payload.
Example:
``` 
msg.repeatdelay = 1000 
msg.repeatxtimes = 3
```
### Confirm if whole message arrived

I wanted to implement a function that will check if whole message arrived.
So i wrote an option if checked on the send node ``Send letter number`` to add msg.payload lenght between square brackets ([]) and append it to the end of the message.

If this option is also checked on the listen node ``Check received string`` when the message is received msg.minimodem.receivedmatch will output `true` and msg.minimodem.receivedlenght will output the lenght of the message.

### Output 
Depending on the selected options of listen node, msg.payload will always be the message that is received trought minimodem. 
Listen nodes also outputs the `msg.minimodem` object that contains:
1. Received Lenght info.
2. Time of received. 
3. Selected options from node options.

## NOTE
I have not tested this node whole lot, but i know that in order to send and receive a message you will need to setup same options on both listen and send nodes!

# Bugs 
There are some bugs for node status messages, that i plan to fix in the future, but i wanted to see what node red community thinks about my of coding skills. 





