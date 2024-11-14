const hexToBytes = hex => Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const bytesToHex = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

// from 'https://cdn.jsdelivr.net/npm/@noble/secp256k1@latest';
const { getSharedSecret, schnorr, utils } = nobleSecp256k1;
const sha256 = nobleSecp256k1.utils.sha256;

const randomPrivKey = () => bytesToHex(nobleSecp256k1.utils.randomPrivateKey());
const getPubKey = privkey => nobleSecp256k1.getPublicKey(privkey, true).substring(2);
const randomSubId = () => randomPrivKey().substring(0, 16);

const LAB_PRIV_KEY = "0d8df56b1a5bc32e7016d019e3069637aafaf0bbd20c023720585c13582aeec3";


//. THis is a labs public and trusted key 
const LAB_PUB_KEY = "f6e2f850a7f9e6ba6fd1e7f60bd68bbf2e0b3c0a1f27bb8edf802baadb7cbf51";


const getSignedNote = async (note, privateKey) => {
    var noteData = serializeNote(note);
    note.id = bytesToHex(await sha256((new TextEncoder().encode(noteData))));
    note.sig = await schnorr.sign(note.id, privateKey);
    return note;
};
const serializeNote = (note) => {
    return JSON.stringify([
        0,
        note['pubkey'],
        note['created_at'],
        note['kind'],
        note['tags'],
        note['content'],
    ]);
};
const verifyNoteId = async (note) => {
    const serialized_content = bytesToHex(await sha256((new TextEncoder().encode(serializeNote(note)))));
    return note.id === serialized_content;
};
const verifyNoteSignature = (note) => {
    return schnorr.verify(note.sig, note.id, note.pubkey);
};
const base64ToHex = (str) => {
    var raw = atob(str);
    var result = '';
    var i; for (i = 0; i < raw.length; i++) {
        var hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result;
};
const encrypt = (privkey, pubkey, text) => {
    var key = nobleSecp256k1.getSharedSecret(privkey, '02' + pubkey, true).substring(2);
    var iv = window.crypto.getRandomValues(new Uint8Array(16));
    var cipher = browserifyCipher.createCipheriv('aes-256-cbc', hexToBytes(key), iv);
    var encryptedMessage = cipher.update(text, "utf8", "base64");
    emsg = encryptedMessage + cipher.final("base64");
    var uint8View = new Uint8Array(iv.buffer);
    return emsg + "?iv=" + btoa(String.fromCharCode.apply(null, uint8View));
};
const decrypt = (privkey, pubkey, ciphertext) => {
    var [emsg, iv] = ciphertext.split("?iv=");
    var key = nobleSecp256k1.getSharedSecret(privkey, '02' + pubkey, true).substring(2);
    var decipher = browserifyCipher.createDecipheriv(
        'aes-256-cbc',
        hexToBytes(key),
        hexToBytes(base64ToHex(iv))
    );
    var decryptedMessage = decipher.update(emsg, "base64");
    dmsg = decryptedMessage + decipher.final("utf8");
    return dmsg;
};
