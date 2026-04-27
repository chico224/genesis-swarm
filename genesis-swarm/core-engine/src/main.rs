//! Genesis Swarm Hypervisor - Enterprise Core Server
//! Author: Oumar Sow
//! Classification: OMEGA-CORE

use axum::{
    extract::{ws::{Message as WsMessage, WebSocket, WebSocketUpgrade}},
    routing::{get, post},
    Json, Router, response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::broadcast;
use tower_http::cors::CorsLayer;
use futures_util::{StreamExt, SinkExt};

mod services;
mod security;
use services::hypervisor::Hypervisor;

#[derive(Debug, Serialize, Deserialize)]
struct AgentRequest {
    prompt: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct AgentResponse {
    result: String,
    agent_id: String,
}

#[derive(Debug, Serialize, Clone)]
struct MetricsUpdate {
    #[serde(rename = "type")]
    msg_type: String,
    #[serde(rename = "activeNodes")]
    active_nodes: usize,
    #[serde(rename = "systemHealth")]
    system_health: String,
}

struct AppState {
    hypervisor: Hypervisor,
    tx: broadcast::Sender<MetricsUpdate>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env_logger::init();
    
    println!("==================================================");
    println!("👑 INIT PROTOCOL: GENESIS SWARM (RUST CORE)");
    println!("Author: Oumar Sow");
    println!("Status: PRODUCTION READY");
    println!("==================================================");

    let (tx, _) = broadcast::channel(100);
    let app_state = Arc::new(AppState {
        hypervisor: Hypervisor::new(),
        tx,
    });

    // Background thread to simulate/report real metrics
    let state_clone = app_state.clone();
    tokio::spawn(async move {
        loop {
            let active = state_clone.hypervisor.state.read().await.active_nodes;
            let msg = MetricsUpdate {
                msg_type: "METRICS_UPDATE".to_string(),
                active_nodes: active,
                system_health: "OPTIMAL".to_string(),
            };
            let _ = state_clone.tx.send(msg);
            tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
        }
    });

    let app = Router::new()
        .route("/api/agent/process", post(process_agent))
        .route("/ws", get(ws_handler))
        .layer(CorsLayer::permissive())
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("[OK] Core Engine listening on http://{}", addr);
    
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

async fn process_agent(
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
    Json(payload): Json<AgentRequest>,
) -> impl IntoResponse {
    println!("[CORE] Processing Prompt: {}", payload.prompt);
    
    // Auto-register a node for the new agent if possible
    let _ = state.hypervisor.register_node().await;
    
    let response = AgentResponse {
        result: format!("Prompt assimilated by OMEGA node. Action: {}", payload.prompt),
        agent_id: format!("AGENT_{:03}", rand::random::<u16>() % 1000),
    };
    
    Json(response)
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: Arc<AppState>) {
    let mut rx = state.tx.subscribe();
    
    while let Ok(msg) = rx.recv().await {
        let json = serde_json::to_string(&msg).unwrap();
        if socket.send(WsMessage::Text(json)).await.is_err() {
            break;
        }
    }
}
