from brownie import PhysicalAddressValidation, accounts, network, config

LOCAL_CHAINS = ["development"]


def get_account():
    if network.show_active() in LOCAL_CHAINS:
        return accounts[0]
    return accounts.add(config['wallets']['from_key'])


def main():
    account = get_account()
    return PhysicalAddressValidation.deploy('South Park', {'from': account}, publish_source=True)
