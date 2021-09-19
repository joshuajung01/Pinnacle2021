const StellarSdk = require('stellar-sdk')
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

async function parse(str) {
    console.log("stellar");
    var words = str.trim().split(" ");
    let command = words[1];

    switch(command) {
        case "balance":
            //console.log("balance for " + pubkey);
            if (words.length == 3){
                pubkey = words[2];
                return await stellarBalance(pubkey);
            }
            else{
                return "Please add arguments in the form: stellar balance <pubkey>";
            }
        case "pay":
            if (words.length == 6){
                amt = words[2];
                dest = words[3];
                pubkey = words[4];
                privkey = words[5];
                return await stellarTransaction(pubkey, dest, amt, privkey);
            }
            else if (words.length == 7){
                amt = words[2];
                dest = words[3];
                pubkey = words[4];
                privkey = words[5];
                memo = words[6];
                return await stellarTransaction(pubkey, dest, amt, privkey, memo);
            }
            else {
                return "Please add arguments in the form: stellar pay <amt> <dest> <pubkey> <privkey> <memo[optional]>";
            }

        case "fund":
            if (words.length == 6){
                amt = words[2];
                newacc = words[3];
                pubkey = words[4];
                privkey = words[5];
                return await stellarFund(pubkey, newacc, amt, privkey);
            }
            else {
                return "Please add arguments in the form: stellar fund <amt> <newacc> <pubkey> <privkey>";
            }

        case "create":
            return await stellarKeyPair();

        case "list":
            if (words.length == 4){
                entries = words[2];
                pubkey = words[3];
                return await stellarHistory(pubkey, entries);
            }
            else {
                return "Please add arguments in the form: stellar list <entries> <pubkey>";
            }

        default:
            return query.query(message);
    }

}

//Generate Stellar Key Pair
async function stellarKeyPair(){
    var newkeypair = StellarSdk.Keypair.random();
    var key_str = "Public Key: " + newkeypair.publicKey() + "\nSecret Key: " + newkeypair.secret(); 
    console.log(key_str);
    return key_str;
}

//Check Stellar Account Balance
async function stellarBalance(pubkey){
    const account = await server.loadAccount(pubkey);
    for (const bal of account.balances) { 
        if(bal['asset_type'] == 'native'){
            return "Your XLM balance is: " + bal.balance;
        }
    }
}

//Conduct a payment transaction on Stellar
async function stellarTransaction(pubkey, dest, amt, privkey, memo_str = null) {
    const account = await server.loadAccount(pubkey);
    /*
        Right now, we have one function that fetches the base fee.
        In the future, we'll have functions that are smarter about suggesting fees,
        e.g.: `fetchCheapFee`, `fetchAverageFee`, `fetchPriorityFee`, etc.
    */
    const fee = await server.fetchBaseFee();

    var memo_in = StellarSdk.Memo.none();

    if(memo_str != null){
        memo_in = StellarSdk.Memo.text(memo_str);
    }

    const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: StellarSdk.Networks.TESTNET, memo: memo_in })
        .addOperation(
            // this operation pays the dest account with XLM
            StellarSdk.Operation.payment({
                destination: dest,
                asset: StellarSdk.Asset.native(),
                amount: amt
            })
        )
        .setTimeout(60)
        .build();

    // sign the transaction
    transaction.sign(StellarSdk.Keypair.fromSecret(privkey));

    try {
        const transactionResult = await server.submitTransaction(transaction);
        //console.log(transactionResult);
        //console.log("Transaction Successful!");
        return "Transaction Successful!";

    } catch (err) {
        //console.error(JSON.stringify(err['response']['data']['extras']['result_codes']['operations'], null, 2));
        var error_msg = "Transaction failed. Reason: ";
        error_msg += err['response']['data']['extras']['result_codes']['operations'].toString();
        //console.log(error_msg);
        return error_msg;
    }
}

//Fund Account on Stellar
async function stellarFund(pubkey, dest, amt, privkey) {
    const account = await server.loadAccount(pubkey);
    /*
        Right now, we have one function that fetches the base fee.
        In the future, we'll have functions that are smarter about suggesting fees,
        e.g.: `fetchCheapFee`, `fetchAverageFee`, `fetchPriorityFee`, etc.
    */
    const fee = await server.fetchBaseFee();

    const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: StellarSdk.Networks.TESTNET})
        .addOperation(
            // this operation pays the dest account with XLM
            StellarSdk.Operation.createAccount({
                destination: dest,
                startingBalance: amt,
            })
        )
        .setTimeout(60)
        .build();

    // sign the transaction
    transaction.sign(StellarSdk.Keypair.fromSecret(privkey));

    try {
        const transactionResult = await server.submitTransaction(transaction);
        //console.log(transactionResult);
        //console.log("Transaction Successful!");
        return "New Account Funded!";

    } catch (err) {
        //console.error(JSON.stringify(err['response']['data']['extras']['result_codes']['operations'], null, 2));
        var error_msg = "Transaction failed. Reason: ";
        error_msg += err['response']['data']['extras']['result_codes']['operations'].toString();
        //console.log(err);
        return error_msg;
    }
}

    
async function stellarHistory(pubkey, entries){
    // get a list of transactions submitted by a particular account
    const t_list = await server.transactions().forAccount(pubkey).includeFailed(false).order("desc").limit(entries).call();

    var list_str = "";

    for (const t of t_list['records']){

        const t_id = t['id'];
        //console.log("TRANSACTION ID: " + t_id);
        list_str += "TRANSACTION ID: " + t_id + "\n";
        if(t['memo'] != null){
            //console.log("TRANSACTION MEMO: " + t['memo']);
            list_str += "TRANSACTION MEMO: " + t['memo'] +"\n";
        }

        const p_list = await server.payments().forTransaction(t_id).call();

        for (const p of p_list['records']){
            //console.log(p);

            if(p['asset_type'] == 'native'){

                if(p['from'] == pubkey){
                    //console.log(p['created_at'] + ": -" + p['amount'] + " XLM");
                    list_str += p['created_at'] + ": -" + p['amount'] + " XLM\n";
                }
                else if(p['to'] == pubkey){
                    //console.log(p['created_at'] + ": +" + p['amount'] + " XLM");
                    list_str += p['created_at'] + ": +" + p['amount'] + " XLM\n";
                }
            }

        }
        list_str += "\n";
        //console.log("");
    }
    return list_str;
}


  
module.exports = {parse};