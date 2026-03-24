import * as openpgp from 'openpgp'

// Sign a text message with the merchant's PGP private key.
// Returns the armored PGP signature block only (-----BEGIN PGP SIGNATURE----- ... -----END PGP SIGNATURE-----)
export const signMessage = async (armoredPrivateKey, passphrase, text) => {
  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: armoredPrivateKey }),
    passphrase,
  })
  const message = await openpgp.createCleartextMessage({ text })
  const signed = await openpgp.sign({ message, signingKeys: privateKey })
  const match = signed.match(/-----BEGIN PGP SIGNATURE-----([\s\S]+?)-----END PGP SIGNATURE-----/)
  return match[0]
}

// Decrypt a PGP-asymmetrically-encrypted message using the merchant's PGP private key.
// Used to decrypt the symmetricKeyEncrypted value from a seller's trade request.
export const decryptMessage = async (armoredMessage, armoredPrivateKey, passphrase) => {
  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: armoredPrivateKey }),
    passphrase,
  })
  const message = await openpgp.readMessage({ armoredMessage })
  const { data } = await openpgp.decrypt({ message, decryptionKeys: privateKey })
  return data
}

// Encrypt a text message symmetrically using AES-128 (OpenPGP cipher 2, matching the Peach app).
// Returns an armored PGP symmetrically-encrypted message string.
export const encryptSymmetric = async (text, symmetricKey) => {
  const message = await openpgp.createMessage({ text })
  return openpgp.encrypt({
    message,
    passwords: [symmetricKey],
    config: { preferredSymmetricAlgorithm: openpgp.enums.symmetric.aes128 },
  })
}
