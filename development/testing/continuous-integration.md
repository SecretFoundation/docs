# Continuous Integration

We recommend when writing Secret Contracts to leverage a CI platform to create a continuous integration flow for your contract.

The two types of tests to focus on:

* Unit Tests - tests that are executed only in the context of the contract itself
* Integration Tests - tests that include executing contract flows on a running chain (LocalSecret)

Our platform of choice is GitHub Actions. GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline. You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.

Here are examples of how to implement these flows in your own contracts:

* Unit Tests - [https://github.com/scrtlabs/SecretJack/blob/master/.github/workflows/Static.yml](https://github.com/scrtlabs/SecretJack/blob/master/.github/workflows/Static.yml)
* Integration Tests - [https://github.com/scrtlabs/SecretJack/blob/master/.github/workflows/Integration.yml](https://github.com/scrtlabs/SecretJack/blob/master/.github/workflows/Integration.yml)\\

Note that in this example the unit test flow executes the main command `make unit-test`, while the integration tests initialize a LocalSecret instance, and execute a Typescript file that handles deployment, initialization and execution of the test logic. You can find that file [here](https://github.com/scrtlabs/SecretJack/blob/master/contract/tests/integration.ts).
