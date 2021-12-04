// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PhysicalAddressValidation {
    string neighborhood;

    struct tokenInfo {
        uint256 nonce;
        address ethAddress;
    }

    // String for now, but maybe USPS has an abstract unique ID for address. In which case we should use that
    mapping(address => string) public onChainToPhysicalAddresses;

    mapping(string => tokenInfo) public oneTimeUseTokens;

    constructor(string memory _neighborhood) {
        neighborhood = _neighborhood;
    }

    function getNonceForAddress(
        string memory physicalAddressHash,
        address ethAddress
    ) public returns (uint256) {
        // TODO: ensure that only trusted USPS address can call this
        // for prod apps you want to use a verifiable randomness oracle rather than use previous block number
        uint256 notsecurenonce = uint256(blockhash(block.number-1));
        // currently it just overrides the old address hash for the user
        // so only one user at the address can generate a nonce
        oneTimeUseTokens[physicalAddressHash] = tokenInfo(notsecurenonce, ethAddress);
        return notsecurenonce;
    }

    function registerAddress(
        string memory physicalAddressHash,
        uint256 notsecurenonce, 
        string memory proofOfAddress //signature of the hash of the jws
    ) public {
        // ensure that the token has not already been used, and that it matches up with the physical address provided as an arg to this function
        // TODO: lookup the ETH address from the physical address hash
        // TODO: verify the proof of address is signed by the eth address

    }
    // external function to add one-time use token, BUT make sure that to validate it can only be called by the contract creator.
}
