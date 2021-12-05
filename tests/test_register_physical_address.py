import pytest
from web3 import Web3
import json
from eth_abi import encode_abi
# from brownie import PhysicalAddressValidation, accounts
from eth_account.messages import encode_defunct, _hash_eip191_message

@pytest.fixture
def contract(PhysicalAddressValidation, accounts):
    return accounts[0].deploy(PhysicalAddressValidation, "Test" )

@pytest.fixture
def w3(web3):
    return Web3(Web3.HTTPProvider())

def test_get_nonce_for_hash_returns_last_block(w3, contract, accounts):
    block = w3.eth.getBlock('latest')
    blockAsInt = int(block.hash.hex(), 16)
    physicalAddressHash = Web3.keccak(text='Test').hex()[1:] # strip the 0x
    tx = contract.getNonceForAddress(physicalAddressHash, accounts[1], {'from': accounts[0]})
    tx.wait(required_confs=1)
    nonce = tx.return_value
    assert nonce == blockAsInt


def test_register_address(w3, contract, accounts):
    physicalAddressHash = Web3.keccak(text='Test').hex()[1:] # strip the 0x
    userAccount = accounts.add('8fa2fdfb89003176a16b707fc860d0881da0d1d8248af210df12d37860996fb2')
    print(userAccount.address)
    tx = contract.getNonceForAddress(physicalAddressHash, userAccount.address, {'from': accounts[0]})
    tx.wait(required_confs=1)
    print("myaddress",contract.myaddress)
    nonce = tx.return_value
    # jsonobject = json.dumps({
    #     "physicalAddressHash": physicalAddressHash,
    #     "nonce": nonce
    # })
    encodedABI = encode_abi(['string', 'uint256'], [physicalAddressHash, nonce])
    # encodedABIObject = encode_defunct(encodedABI)
    signedMessage = userAccount.sign_defunct_message(encodedABI.hex())
    # call as the user
    tx2 = contract.registerAddress(physicalAddressHash, nonce, signedMessage.signature)
    tx2.wait(required_confs=1)