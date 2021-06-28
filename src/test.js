
 const SHA256 = require('crypto-js/sha256');
 const hex2ascii = require('hex2ascii');
 const BlockClass = require('./block.js');

 
 
class Blockchain {

    /**
     * Constructor of the class, you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialized the chain creating
     * the Genesis Block.
     * The methods in this class will always turn a Promise to allow client applications or
     * other backends to call asynchronous functions.
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    /**
     * This method will check for the height of the chain and if there isn't a Genesis Block it will create it.
     * You should use the `addBlock(block)` to create the Genesis Block
     * Passing as a data `{data: 'Genesis Block'}`
     */
    async initializeChain() {
        if( this.height === -1){
            let block = new BlockClass.Block({data: 'Genesis Block'});
            await this._addBlock(block);
        }
    }

    /**
     * Utility method that return a Promise that will resolve with the height of the chain
     */
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    /**
     * _addBlock(block) will store a block in the chain
     * @param {*} block 
     * The method will return a Promise that will resolve with the block added
     * or reject if an error happen during the execution.
     * You will need to check for the height to assign the `previousBlockHash`,
     * assign the `timestamp` and the correct `height`...At the end you need to 
     * create the `block hash` and push the block into the chain array. Don't for get 
     * to update the `this.height`
     * Note: the symbol `_` in the method name indicates in the javascript convention 
     * that this method is a private method. 
     */
     _addBlock(newBlock) {
        let self = this;
        return new Promise(async (resolve) => {
            newBlock.height = self.chain.length;                                            // Block Height (consecutive number of each block)
            newBlock.time = new Date().getTime().toString().slice(0,-3);                   // Timestamp for the Block creation
            if (this.chain.length == 0){          
                newBlock.previousBlockHash = "";   
                newBlock.hash = newBlock.generateHash()
                self.height++ 
                self.chain.push(newBlock);
            } else {
                newBlock.previousBlockHash = self.chain[self.chain.length-1].hash;   
                newBlock.hash = newBlock.generateHash()
                self.chain.push(newBlock);
                self.height++ 
            }
            resolve();
        });
    }
    getBlockByHeight(height) {
        let self = this;
        return new Promise((resolve, reject) => {
            let block = self.chain.filter(p => p.height === height)[0];
            if(block){
                resolve(block);
            } else {
                resolve(null);
            }
        });
    }
    getStarsByWalletAddress (address) {
        let self = this;
        let stars = [];
        return new Promise((resolve, reject) => {
            let ownerBlockArray = self.chain.filter(p =>JSON.parse(p.getBData()).address === address);
            for(let i=0; i< ownerBlockArray.length; i++){
                stars.push({ "owner": `${JSON.parse(ownerBlockArray.getBData()).address}`, "star": `${JSON.parse(ownerBlockArray.getBData()).star}`});
            }
            if(stars){
                resolve(stars);
            } else {    
                reject(null);
            }        
        });
    }

    submitStar(address, message, signature, star) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            // let time = parseInt(message.split(':')[1]);
            // let currentTime = parseInt(new Date().getTime().toString().slice(0,-3));
            let submitdata = address+"|"+message+"|"+signature+"|"+star;
            // if ( (currentTime- time)/60 <5){
            //     if (bitcoinMessage.verify(message,address,signature)){
                    let newBlock = new BlockClass.Block({data: submitdata});
                    this._addBlock(newBlock);
                    resolve(newBlock);
            //     }
            //     reject();
            // } else {
            //     reject();
            // }
        });
    }


    // submitStar(address, message, signature, star) {
    //     let self = this;
    //     return new Promise(async (resolve, reject) => {
    //         // let time = parseInt(message.split(':')[1]);
    //         // let currentTime = parseInt(new Date().getTime().toString().slice(0,-3));

    //         //let submitdata =   `{"address": "${address}", "message": "${message}", "signature": "${signature}", ${star} }`;
    //         let submitdata =   `{"address": "${address}", "message": "${message}", "signature": "${signature}", "star": ${JSON.stringify(JSON.parse(JSON.stringify(star.star)))} }`;

    //         //let submitdata =   `{"address": "${address}", "message": "${message}", "signature": "${signature}", "star": "${JSON.parse(JSON.stringify(star))}" }`;
    //         // if ( (currentTime- time)/60 <5){
    //         //     if (bitcoinMessage.verify(message,address,signature)){
    //                 let newBlock = new BlockClass.Block(submitdata);
    //                 self._addBlock(newBlock);
    //                 resolve(newBlock);
    //         //     }
    //         //     reject();
    //         // } else {
    //         //     reject();
    //         // }
    //     });
    // }
};