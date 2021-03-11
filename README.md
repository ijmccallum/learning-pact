# Learning Pact

This repo became a thing because they way I understand pact is pretty different to the way it's explained in the pact docs. So here I've worked up a super minimal example and written up the clearest explanations I could conjure that make sense to me. Hopefully this will make it all stick.

I'm going to assume if you're here you know roughly what it's doing so I'll skip the pact intro stuff and jump to explaining the layout of this repo. 

`./provider` is a tiny API and `./consumer` is a teeny... thing that calls the tiny API. They both have the fairly standard `package.json` / `./node_modules` / `./src` stuff and for their pact contract code I've given each a `./pact` directory.

## In the consumer (creating a contract)

Pact is consumer driven which means the contract between both parties is created by the consumer. So, for this part we're in `./consumer` where we run `npm run pact`. That'll run `./consumer/pact/generate-contract.js` so have a look in there to see how it is defining a contract. Read through the comments in that file then pop back here for the second half.

## Part 2: The provider (testing the API with the contract)

Now that we have the contract defined, we need to confirm that the API actually abides by it. So we're jumping over to the `./provider` side and will run the `pact` script in that package.json. That'll run `./provider/pact/run-contract.js` so have a look in there to see how we make pact test the API with our contract. 

