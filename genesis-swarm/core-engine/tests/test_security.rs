//! Tests: Security & Resilience
//! Author: Oumar Sow

use genesis_core::security::encryption::CipherEngine;
use genesis_core::security::ghost_daemon::GhostDaemon;

#[test]
fn test_zero_trust_encryption() {
    let cipher = CipherEngine::new("OMEGA_KEY");
    let encrypted = cipher.encrypt("SECRET_DATA");
    
    assert!(encrypted.starts_with("ENCRYPTED_"), "Le chiffrement doit préfixer la trame.");
    
    let decrypted = cipher.decrypt(&encrypted);
    assert!(decrypted.is_ok(), "Le décryptage avec la bonne clé doit réussir.");
}

#[test]
fn test_encryption_tampering() {
    let cipher = CipherEngine::new("OMEGA_KEY");
    let result = cipher.decrypt("PLAIN_TEXT_ATTACK");
    assert!(result.is_err(), "Les trames non chiffrées doivent être bloquées.");
    assert_eq!(result.unwrap_err(), "CORRUPTED_PAYLOAD");
}

#[test]
fn test_ghost_daemon_heartbeat() {
    let mut daemon = GhostDaemon::new();
    assert!(!daemon.heartbeat(), "Le démon ne doit pas battre avant l'attachement.");
    
    daemon.attach_to_system();
    assert!(daemon.heartbeat(), "Le démon doit maintenir le système éveillé.");
    assert_eq!(daemon.uptime_seconds, 1);
}
