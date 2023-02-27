# Securing-health-records-using-blockchain

This is a decentralized application about storing health records on blockchain

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This Project is based on blockchain where we can store the electronic health records.We apply Ethereum blockchain to compose a smart contract which holds the public key of
the record stored in the decentralised Inter Planetary File System (IPFS). To protect a patient’s
privacy, we have a tendency to use a proxy re-encryption theme once the info square measure
transferred. we have a tendency to designed and implemented numerous smart contracts to handle
business logic in agreement by member organizations of the network.
This is how we do it:

- We create a contract for every patient
- Whatever documents the patient adds we add it in IPFS.
- we retrieve the hash and store it in blockchain.
- For a particular record access is given only to the doctor and patient.

### Built With

Major tools:

- [Solidity](https://docs.soliditylang.org/en/v0.8.4/)
- [nodeJS](https://nodejs.org/en/)
- [ReactJS](https://reactjs.org)
- [Bootstrap](https://getbootstrap.com)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/thestackdev/ehr-blockchain.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the dev script
   ```sh
   npm run dev
   ```
4. You can view the site in your localhost
