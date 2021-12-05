# ALL THE ADDRESSES

Privacy-focused proof of residence

## DEVELOPMENT

* You need ganache-cli to be installed globally

```
npm install ganache-cli@latest --global
```

* Make virtualenv

```
python3 -m venv .venv
```

* Activate

```
source .venv/bin/activate
```

* Install dependencies

```
pip3 install -r requirements.txt
```

* Install hardhat

```
npm install --save-dev hardhat
```

* Run the brownie console

```
brownie console --network hardhat
```

* Deploy the contract

```
>>> from brownie import PhysicalAddressValidation
>>> PhysicalAddressValidation.deploy("Haight-Ashbury", {'from': accounts[0]})
Transaction sent: 0xd5e48ca6d0757c7a80b043467c75290841aa401cdd4d2ee32e7fabdb1ef241af
  Gas price: 0.0 gwei   Gas limit: 30000000   Nonce: 0
  PhysicalAddressValidation.constructor confirmed   Block: 1   Gas used: 365277 (1.22%)
  PhysicalAddressValidation deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

<PhysicalAddressValidation Contract '0x5FbDB2315678afecb367f032d93F642f64180aa3'>
```

* Getting the nonce to include in the JWS payload from USPS

```
>>> from brownie import PhysicalAddressValidation
>>> contract = PhysicalAddressValidation.deploy("Haight-Ashbury", {'from': accounts[0]})
>>> tx = contract.getNonceForAddress("hello", accounts[0], {'from': accounts[0]})
Transaction sent: 0xa5e2e5913d1bb4039686c98d1eba0a60769129d421f1502dc931416220261807
  Gas price: 0.0 gwei   Gas limit: 30000000   Nonce: 5
  PhysicalAddressValidation.getNonceForAddress confirmed   Block: 7   Gas used: 30506 (0.10%)

>>> tx.wait(required_confs=1)
  PhysicalAddressValidation.getNonceForAddress confirmed   Block: 7   Gas used: 30506 (0.10%)

>>> tx.return_value
31760896270286750921513780405400723455504159518588582047435567786050942714114
```

