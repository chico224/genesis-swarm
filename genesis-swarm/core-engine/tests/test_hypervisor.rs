//! Enterprise Unit Tests for Rust Hypervisor
//! Author: Oumar Sow

use genesis_core::services::hypervisor::Hypervisor;
use genesis_core::services::synaptic_router::Router;

#[tokio::test]
async fn test_hypervisor_boot() {
    let mut hv = Hypervisor::new();
    let res = hv.boot().await;
    assert!(res.is_ok(), "L'hyperviseur doit s'amorcer sans erreur.");
}

#[tokio::test]
async fn test_node_registration_capacity() {
    let hv = Hypervisor::new();
    
    // Enregistrement séquentiel de 500 nœuds — plafond de capacité du cluster
    for _ in 0..500 {
        assert!(hv.register_node().await.is_ok());
    }
    
    // Le 501ème noeud DOIT échouer (Fail-Safe)
    let overflow = hv.register_node().await;
    assert!(overflow.is_err(), "Le système doit bloquer l'overflow cognitif.");
    assert_eq!(overflow.unwrap_err(), "SWARM CAPACITY REACHED");
}

#[test]
fn test_router_validation() {
    let router = Router::new();
    assert!(router.route_message("SIG_ALIVE"), "Le routeur doit accepter les messages valides.");
    assert!(!router.route_message(""), "Le routeur doit rejeter les trames vides.");
}
