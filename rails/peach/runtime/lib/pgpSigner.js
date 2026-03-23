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
