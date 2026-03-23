import { networks, initEccLib, payments } from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
import { BIP32Factory } from 'bip32'
import ecc from '@bitcoinerlab/secp256k1'
import bitcoinMessage from 'bitcoinjs-message'
import { createHash } from 'crypto'

initEccLib(ecc)
const bip32 = BIP32Factory(ecc)

const DERIVATION_PATH = "m/48'/0'/0'/0"
const NETWORK = networks.bitcoin

const getChild = (mnemonic) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  return bip32.fromSeed(seed, NETWORK).derivePath(DERIVATION_PATH)
}

// Sign an arbitrary message with the merchant's BIP32 key.
// Returns { publicKey: hex, signature: hex }
export const signMessage = (mnemonic, message) => {
  const child = getChild(mnemonic)
  const publicKey = child.publicKey.toString('hex')
  const hash = createHash('sha256').update(message).digest('hex')
  const signature = child.sign(Buffer.from(hash, 'hex')).toString('hex')
  return { publicKey, signature }
}

// Derive the merchant's P2SH-P2WPKH address and sign the Peach address-claim message.
// Returns { address: string, signature: base64 }
export const signAddress = (mnemonic, peachId) => {
  const child = getChild(mnemonic)
  const { address } = payments.p2sh({
    redeem: payments.p2wpkh({ pubkey: child.publicKey, network: NETWORK }),
    network: NETWORK,
  })
  const message = `I confirm that only I, peach${peachId}, control the address ${address}`
  const signature = bitcoinMessage.sign(message, child.privateKey, true).toString('base64')
  return { address, signature }
}

// Returns a stable hex string derived from the merchant's public key.
// Used as a deterministic payment-data hash for Peach buy offers.
export const getPublicKeyHash = (mnemonic) => {
  const child = getChild(mnemonic)
  return createHash('sha256').update(child.publicKey.toString('hex')).digest('hex')
}
