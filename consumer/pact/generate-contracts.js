const consumerApplication = require('../src/app.js');
const { Pact } = require("@pact-foundation/pact")
const path = require('path');
const process = require('process');

const run = async () => {

  /* new Pact
   * In the docs this is assigned to a const named "provder".  
   * Here I'm calling it "pactServerSlashContractWriter" because that's pretty much what it's doing.
   * We tell it where (eg the url) our consumer is expecting the provider API to be.
   * Our new pactServerSlashContractWriter will then spin up where the API should be and sit there catching requests.
   */
  const pactServerSlashContractWriter = new Pact({
    host: "127.0.0.1",
    port: 8888,
    log: path.resolve('./pact/pact.log'),
    dir: path.resolve('./pact/contracts'),
    logLevel: 'FATAL',
    consumer: 'theconsumername',
    provider: 'theprovidername'
  });
  await pactServerSlashContractWriter.setup(); // Think of this as .startUp, or if you're into express/koa: .listen

  /* .addInteraction
   * An 'Interaction' is the defenition of a consumer call, eg GET /things,
   * and the expected shape of the providers response, eg 200 {a:'thing'}. 
   * This is the key part of contract testing. 
   * This is the contract!
   */
  pactServerSlashContractWriter.addInteraction({
    state: 'the API is in a certain state',
    uponReceiving: 'a request',
    withRequest: {
      path: '/things',
      method: 'GET',
    },
    willRespondWith: {
      body: {
        a: "thing"
      },
      status: 200
    },
  });

  /* The Consumer App 
   * (Look up top, this is the source code import... sorry, "required").
   * Now that pactServerSlashContractWriter has an interaction defiend we need to provec to it
   * that our code does in fact make thaty call. So we use the consumer application code to make that call.
   * This call will be caught by the pactServerSlashContractWriter and should match the interaction defined above.
   */
  await consumerApplication.getUser();

  /* .verify
   * Now that we've made our source code make that call, we need to tell pactServerSlashContractWriter
   * that we've made that call and that we're ready for it to check that the call matches the interaction. 
   * (feels like there's a PR just waiting to happen here).
   * If you were to comment out the line above, this would fail with "Missing requests:" and a note of 
   * the call that's missing.
   */
  pactServerSlashContractWriter.verify(); // Think of this as pactServerSlashContractWriter.verifyInteraction

  /* .finalize
   * So far it's all just in memory (I think). `.finalize` triggers pact to write down the
   * contract defenition into a json file. It also shuts down the pact server.
   */
  pactServerSlashContractWriter.finalize(); // Think of this as pactServerSlashContractWriter.writePact

  console.log("Done!");
}

/* if there is an error above, the pact mock api could be left 
 * running. This should shut it down regardless.
 */
process.on('SIGINT', () => {
  pact.removeAllServers()
});

//This runs the code above
run();

//and now your done, head back to the readme for part 2!
