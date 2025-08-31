#src/back-end/get-address.py
import os
from dotenv import load_dotenv
from algosdk import mnemonic, account

# Load .env file
load_dotenv()

# Get mnemonic from .env
mnemonic_phrase = os.getenv("RELAYER_MNEMONIC")

if not mnemonic_phrase:
    print("Error: RELAYER_MNEMONIC not found in .env file")
    exit(1)

try:
    # Convert mnemonic to private key
    private_key = mnemonic.to_private_key(mnemonic_phrase)
    # Get public address from private key
    address = account.address_from_private_key(private_key)
    print(f"Your Algorand address: {address}")
except Exception as e:
    print(f"Error: Invalid mnemonic - {str(e)}")