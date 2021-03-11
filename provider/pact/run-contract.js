const Verifier = require('@pact-foundation/pact').Verifier;
const path = require('path');


/* pactVerifierConfig (opts in the pact docs)
 * This is where most of the pact work provider side will be going.
 * There are a lot of wee bits that go in here so I've split it up
 * between all the comments.
 * Note that theprovidername matches the contract json & the consumer 
 * contract code.
 */
const pactVerifierConfig = {
  provider: 'theprovidername'
};

/* .pactUrls
 * This tells pact where your local contract json file is.
 * (If you were using a broker there would be no need for this, 
 * it's only really for local development).
 */
const contractFilePath = path.resolve(`../consumer/pact/contracts/theconsumername-theprovidername.json`);
pactVerifierConfig.pactUrls = [contractFilePath];

/* .pactBrokerUrl 
 * If you were using a broker, putting its url here would trigger pact to download the contract json
 * from that broker. If you're then debugging locally, this can help to ensure that pact only looks
 * at your local contract defined above. (The fact that I have to set this locally is likely just a 
 * quirk specific to my workplace and the many _many_ layers of abstraction we have on _everything_). 
 */
pactVerifierConfig.pactBrokerUrl = undefined;

/* .stateHandlers
 * This can turn into a pretty big one. It's where you get the chance to set up
 * any mocks / do any state preperation for the API. EG if the contract had an interaction
 * with a state of "when database spits fire" then here you'd add 
 * stateHandlers.["when database spits fire"] = () => { ...code to make db spit fire... };
 * 
 * So when the name (or key) of this stateHandlers object matches the `state` that was defined 
 * in an interaction, then the function here will be run before the pact verifier throws that 
 * interaction at the API.
 */
pactVerifierConfig.stateHandlers = {
  'the API is in a certain state': () => {
    /* This gives us the chance to mock out external services 
     * or set up test data, whatever you need to do to prep the provider
     * to return what you're expecting. Hopefully not making a db spit fire.
     */
    console.log('Pact: this is my chance to pose the API.');
  }
}

/* The Provider API
 * Before we can throw the contract at our provider API, 
 * we need said API to be up & running!
 */
const app = require('../src/api');
app.listen(3000);

/* .providerBaseUrl
 * This is where the pact verifier will be sending the 
 * request for each interaction it finds in the contract.
 */
pactVerifierConfig.providerBaseUrl = `http://localhost:3000`;

/* And now we let it fly!
 */
return new Verifier()
  .verifyProvider(pactVerifierConfig)
  .then(output => {
    console.log('PACT: = = = = Provider Verification Complete!')
    console.log(output)
  })
  .catch(e => {
    console.error('PACT: = = = = Provider Verification failed :(', e)
  });
