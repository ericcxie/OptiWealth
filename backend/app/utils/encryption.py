from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes
import base64
import os
import json
from dotenv import load_dotenv

load_dotenv()


class AESCipher:
    def __init__(self, key):
        self.key = key

    def encrypt(self, data):
        """
        Encrypts the given data using AES encryption.

        Args:
            data (str): The data to encrypt.

        Returns:
            str: The base64 encoded IV and encrypted data.
        """
        data = pad(data.encode('utf-8'), AES.block_size)
        iv = get_random_bytes(AES.block_size)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        enc_data = cipher.encrypt(data)
        return base64.b64encode(iv + enc_data).decode('utf-8')

    def decrypt(self, enc_data):
        """
        Decrypts the given encrypted data using AES encryption.

        Args:
            enc_data (str): The base64 encoded IV and encrypted data.

        Returns:
            str: The decrypted data.
        """
        enc_data = base64.b64decode(enc_data)
        iv = enc_data[:AES.block_size]
        ct = enc_data[AES.block_size:]
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(ct)
        pt = unpad(decrypted, AES.block_size)
        return pt.decode('utf-8')


# Load the AES key from an environment variable
aes_key = base64.b64decode(os.getenv('AES_ENCRYPTION_KEY'))
aes_cipher = AESCipher(aes_key)
