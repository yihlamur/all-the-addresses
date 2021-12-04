// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PhysicalAddressValidation {
    // zip code (could be something else, w/e)
    // What state is our contract going to store?
    // onchain addresses => physical addresses
    // one-time-use tokens => bool (maybe we will also want a way to map a one-time-use token to a physical address)
    // external function to register an address (one time use token, the address, the end-user's on-chain address)
    // external function to add one-time use token, BUT make sure that to validate it can only be called by the contract creator.
}
