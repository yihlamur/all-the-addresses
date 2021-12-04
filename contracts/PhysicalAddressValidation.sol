// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PhysicalAddressValidation {
    uint256 zipCode;

    struct tokenInfo {
        bool used;
        string physicalAddress;
    }
    // String for now, but maybe USPS has an abstract unique ID for address. In which case we should use that
    mapping(address => string) public onChainToPhysicalAddresses;

    mapping(string => tokenInfo) public oneTimeUseTokens;

    constructor(uint256 _zipCode) {
        zipCode = _zipCode;
    }

    function registerAddress(
        string memory token,
        string memory physicalAddress,
        address residentAddress
    ) public {
        // ensure that the token has not already been used, and that it matches up with the physical address provided as an arg to this function
    }
    // external function to add one-time use token, BUT make sure that to validate it can only be called by the contract creator.
}
