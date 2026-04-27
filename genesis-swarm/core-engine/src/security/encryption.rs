//! Module: Zero-Trust Encryption
//! Classification: OMEGA-CORE
//! Author: Oumar Sow

use aes_gcm::{
    aead::{Aead, KeyInit, OsRng},
    Aes256Gcm, Nonce, Key
};
use aes_gcm::aead::rand_core::RngCore;

pub struct CipherEngine {
    cipher: Aes256Gcm,
}

impl CipherEngine {
    pub fn new_random() -> Self {
        let key = Aes256Gcm::generate_key(OsRng);
        Self {
            cipher: Aes256Gcm::new(&key),
        }
    }

    /// Chiffrement AES-256-GCM réel avec Nonce aléatoire.
    pub fn encrypt(&self, payload: &[u8]) -> Result<Vec<u8>, String> {
        let mut nonce_bytes = [0u8; 12];
        OsRng.fill_bytes(&mut nonce_bytes);
        let nonce = Nonce::from_slice(&nonce_bytes);

        let ciphertext = self.cipher
            .encrypt(nonce, payload)
            .map_err(|e| format!("Chiffrement échoué: {}", e))?;

        // Format: [nonce 12 bytes][ciphertext]
        let mut result = nonce_bytes.to_vec();
        result.extend_from_slice(&ciphertext);
        Ok(result)
    }

    /// Décryptage AES-256-GCM. Échoue si les données sont altérées.
    pub fn decrypt(&self, data: &[u8]) -> Result<Vec<u8>, String> {
        if data.len() < 12 {
            return Err("CORRUPTED_PAYLOAD: trop court".to_string());
        }
        let (nonce_bytes, ciphertext) = data.split_at(12);
        let nonce = Nonce::from_slice(nonce_bytes);

        self.cipher
            .decrypt(nonce, ciphertext)
            .map_err(|_| "CORRUPTED_PAYLOAD".to_string())
    }
}
