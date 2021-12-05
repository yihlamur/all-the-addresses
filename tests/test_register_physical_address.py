import pytest
from web3 import Web3
# from brownie import PhysicalAddressValidation, accounts

@pytest.fixture
def contract(PhysicalAddressValidation, accounts):
    return accounts[0].deploy(PhysicalAddressValidation, 'Test')

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