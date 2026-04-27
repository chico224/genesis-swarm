//! Module: Hypervisor
//! Author: Oumar Sow
//! Classification: OMEGA-CORE

use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Clone)]
pub struct HypervisorState {
    pub active_nodes: usize,
    pub max_nodes: usize,
}

pub struct Hypervisor {
    pub state: Arc<RwLock<HypervisorState>>,
}

impl Hypervisor {
    pub fn new() -> Self {
        Self {
            state: Arc::new(RwLock::new(HypervisorState {
                active_nodes: 0,
                max_nodes: 500, // Topologie Fractale
            })),
        }
    }

    pub async fn boot(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        log::info!("[BOOT] Genesis Hypervisor Ignition...");
        let state = self.state.read().await;
        log::info!("[OK] Hypervisor online. Capacity: {} nodes.", state.max_nodes);
        Ok(())
    }

    pub async fn register_node(&self) -> Result<(), String> {
        let mut state = self.state.write().await;
        if state.active_nodes >= state.max_nodes {
            return Err("SWARM CAPACITY REACHED".to_string());
        }
        state.active_nodes += 1;
        Ok(())
    }
}
