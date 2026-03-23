import {
  generateKey,
  readKey,
  readPrivateKey,
  decryptKey,
  encrypt,
  decrypt,
  createMessage,
  createCleartextMessage,
  readMessage,
  sign,
} from 'openpgp/lightweight'
import { sha256 } from 'js-sha256'

export default () => {
  const genKey = async (highEntropyToken) => {
    const d = new Date()
    const keyPair = await generateKey({
      type: 'ecc',
      curve: 'curve25519',
      userIDs: [{ name: 'RoboSats ID ' + sha256(sha256(highEntropyToken)) }],
      passphrase: highEntropyToken,
      format: 'armored',
      date: d.setDate(d.getDate() - 1),
    })

    return {
      publicKeyArmored: String(keyPair.publicKey),
      encryptedPrivateKeyArmored: String(keyPair.privateKey),
    }
  }

  const encryptMessage = async (plaintextMessage, ownPublicKeyArmored, peerPublicKeyArmored, privateKeyArmored, passphrase) => {
    const ownPublicKey = await readKey({ armoredKey: ownPublicKeyArmored })
    const peerPublicKey = await readKey({ armoredKey: peerPublicKeyArmored })
    const privateKey = await decryptKey({
      privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase,
    })

    const d = new Date()
    const encryptedMessage = await encrypt({
      message: await createMessage({ text: plaintextMessage }),
      encryptionKeys: [ownPublicKey, peerPublicKey],
      signingKeys: privateKey,
      date: d.setDate(d.getDate() - 1),
    })

    return String(encryptedMessage)
  }

  const decryptMessage = async (encryptedMessage, publicKeyArmored, privateKeyArmored, passphrase) => {
    const publicKey = await readKey({ armoredKey: publicKeyArmored })
    const privateKey = await decryptKey({
      privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase,
    })

    const message = await readMessage({ armoredMessage: encryptedMessage })

    const { data: decrypted, signatures } = await decrypt({
      message,
      verificationKeys: publicKey,
      decryptionKeys: privateKey,
    })

    try {
      await signatures[0].verified
      return { decryptedMessage: String(decrypted), validSignature: true }
    } catch {
      return { decryptedMessage: String(decrypted), validSignature: false }
    }
  }

  const signCleartextMessage = async (message, privateKeyArmored, passphrase) => {
    const privateKey = await decryptKey({
      privateKey: await readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase,
    })

    const unsignedMessage = await createCleartextMessage({ text: message })
    const signedMessage = await sign({
      message: unsignedMessage,
      signingKeys: privateKey,
    })

    return signedMessage
  }

  return {
    genKey,
    encryptMessage,
    decryptMessage,
    signCleartextMessage,
  }
}
